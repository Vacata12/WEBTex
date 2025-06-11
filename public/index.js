let currentDirectoryId = null;

class AuthService {
    static async login(username, password) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }
            
            const data = await response.json();
            console.log('Login response:', data); // Debug log
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(formData) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            return response.json();
        } catch (error) {
            throw error;
        }
    }

    static async logout() {
        try {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            localStorage.removeItem('user'); // Clear user data
            return response.json();
        } catch (error) {
            throw error;
        }
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    } else {
        console.error(`Page with ID ${pageId} not found`);
    }
}

async function loadFiles(directoryId = null) {
    try {
        currentDirectoryId = directoryId;
        const response = await fetch(`/api/files/directory/${directoryId || ''}`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load files');
        
        const data = await response.json();
        renderFilesList(data);
        updateBreadcrumb(directoryId);
    } catch (error) {
        console.error('Load files error:', error);
        alert('Error loading files: ' + error.message);
    }
}

async function updateStorageInfo() {
    try {
        const response = await fetch('/api/files/storage', {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to load storage info');
        
        const storage = await response.json();
        const usedGB = (storage.used / (1024 * 1024 * 1024)).toFixed(2);
        const totalGB = (storage.total / (1024 * 1024 * 1024)).toFixed(2);
        const percentage = (storage.used / storage.total) * 100;

        const usedStorage = document.getElementById('usedStorage');
        const totalStorage = document.getElementById('totalStorage');
        const storageUsed = document.getElementById('storageUsed');

        if (usedStorage && totalStorage && storageUsed) {
            usedStorage.textContent = usedGB;
            totalStorage.textContent = totalGB;
            storageUsed.style.width = `${percentage}%`;
        }
    } catch (error) {
        console.error('Error updating storage info:', error);
    }
}

function createBreadcrumbElement() {
    const container = document.querySelector('.files-container');
    const breadcrumb = document.createElement('div');
    breadcrumb.id = 'breadcrumb';
    breadcrumb.className = 'breadcrumb';
    container.insertBefore(breadcrumb, container.firstChild);
    return breadcrumb;
}

async function updateBreadcrumb(directoryId) {
    const breadcrumb = document.getElementById('breadcrumb') || createBreadcrumbElement();
    
    if (!directoryId) {
        breadcrumb.innerHTML = '<span class="breadcrumb-item" onclick="loadFiles(null)">Root</span>';
        return;
    }

    try {
        const response = await fetch(`/api/files/path/${directoryId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to load path');
        
        const path = await response.json();
        breadcrumb.innerHTML = `
            <span class="breadcrumb-item" onclick="loadFiles(null)">Root</span>
            ${path.map(dir => `
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item" onclick="loadFiles('${dir._id}')">${dir.name}</span>
            `).join('')}
        `;
    } catch (error) {
        console.error('Breadcrumb error:', error);
    }
}

async function initializeSearch() {
    const searchInput = document.getElementById('fileSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        console.error('Search elements not found');
        return;
    }
    
    try {
        const response = await fetch('/api/files/all', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch files for search');
        }
        
        const data = await response.json();
        const files = data.items || [];
        
        const { handleSearch } = await import('./utils/fileSearch.js');
        
        handleSearch(searchInput, searchResults, files);
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

function getCurrentDirectoryId() {
    return currentDirectoryId;
}

function updateUIForAuthState(user) {
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const usernameDisplay = document.getElementById('username-display');
    const dashboardPage = document.getElementById('dashboard');
    const homePage = document.getElementById('home');
    const loginPage = document.getElementById('login');
    const registerPage = document.getElementById('register');
    const aboutPage = document.getElementById('about');

    if (!guestNav || !userNav || !usernameDisplay || !dashboardPage || !homePage || !loginPage || !registerPage || !aboutPage) {
        console.error('One or more UI elements not found');
        return;
    }

    console.log('Updating UI for user:', user); // Debug log

    if (user && user.username) {
        guestNav.style.display = 'none';
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        aboutPage.style.display = 'none';

        userNav.style.display = 'flex';
        dashboardPage.style.display = 'block';
        usernameDisplay.textContent = user.username;

        initializeSearch();
        loadFiles();
        updateStorageInfo();
    } else {
        guestNav.style.display = 'flex';
        homePage.style.display = 'block';
        userNav.style.display = 'none';
        dashboardPage.style.display = 'none';
        usernameDisplay.textContent = '';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        aboutPage.style.display = 'none';
        
        showPage('login');
        
        const fileList = document.getElementById('filesList');
        if (fileList) fileList.innerHTML = '';
    }
}

function showUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) modal.style.display = 'block';
}

function showCreateDirectoryModal() {
    const modal = document.getElementById('directoryModal');
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

async function downloadFile(fileId) {
    try {
        const response = await fetch(`/api/files/download/${fileId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Download error:', error);
        alert('Error downloading file: ' + error.message);
    }
}

async function deleteFile(fileId) {
    if (!confirm('Are you sure you want to delete this file?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/files/delete/${fileId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Delete failed');
        }
        
        await loadFiles();
        alert('File deleted successfully');
    } catch (error) {
        console.error('Delete error:', error);
        alert('Error deleting file: ' + error.message);
    }
}

async function handleLogout() {
    try {
        await AuthService.logout();
        updateUIForAuthState(null);
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}

function renderFilesList(files) {
    const filesList = document.getElementById('filesList');
    if (!filesList) {
        console.error('Files list element not found');
        return;
    }

    if (!files.items || files.items.length === 0) {
        filesList.innerHTML = `
            <div class="empty-state">
                <p>This folder is empty</p>
            </div>
        `;
        return;
    }

    filesList.innerHTML = files.items.map(file => `
        <div class="file-item">
            <div class="file-name">
                ${file.name}
            </div>
            <div>${new Date(file.lastModified).toLocaleDateString()}</div>
            <div>${file.type === 'directory' ? '--' : formatFileSize(file.size)}</div>
            <div class="file-actions">
                ${file.type === 'directory' ? 
                    `<button class="action-button" onclick="loadFiles('${file._id}')">Open</button>` :
                    `<button class="action-button" onclick="downloadFile('${file._id}')">Download</button>`
                }
                <button class="action-button delete-btn" onclick="deleteFile('${file._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Session check response:', data); // Debug log
            if (data.user && data.user.username) {
                updateUIForAuthState(data.user);
                showPage('dashboard');
            } else {
                updateUIForAuthState(null);
            }
        } else {
            updateUIForAuthState(null);
        }
    } catch (error) {
        console.error('Session check failed:', error);
        updateUIForAuthState(null);
    }

    const loginForm = document.querySelector('#login form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                const response = await AuthService.login(username, password);
                console.log('Login handler response:', response); // Debug log
                if (response.success && response.user && response.user.username) {
                    updateUIForAuthState(response.user);
                    showPage('dashboard');
                    loginForm.reset();
                } else {
                    throw new Error('Invalid user data received');
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }

    const registerForm = document.querySelector('#register form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = {
                    firstName: document.getElementById('firstName').value,
                    lastName: document.getElementById('lastName').value,
                    username: document.getElementById('newUsername').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('newPassword').value,
                    confirmPassword: document.getElementById('confirmPassword').value
                };
                
                await AuthService.register(formData);
                showPage('login');
                alert('Registration successful! Please login.');
                registerForm.reset();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            const fileInput = document.getElementById('fileInput');
            if (fileInput.files[0]) {
                formData.append('uploadFile', fileInput.files[0]);
                // Add the current directory as parent
                if (currentDirectoryId) {
                    formData.append('parent', currentDirectoryId);
                }
            } else {
                alert('Please select a file');
                return;
            }
            
            try {
                const response = await fetch('/api/files/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (!response.ok) throw new Error('Upload failed');
                
                closeModal('uploadModal');
                await loadFiles();
                uploadForm.reset();
                alert('File uploaded successfully!');
            } catch (error) {
                alert('Error uploading file: ' + error.message);
            }
        });
    }

    const directoryForm = document.getElementById('directoryForm');
    if (directoryForm) {
        directoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const directoryName = document.getElementById('directoryName').value;
            
            if (!directoryName) {
                alert('Directory name is required');
                return;
            }
            
            try {
                const response = await fetch('/api/files/directory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        name: directoryName,
                        parent: getCurrentDirectoryId()
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to create directory');
                }
                
                closeModal('directoryModal');
                await loadFiles(getCurrentDirectoryId());
                directoryForm.reset();
                alert('Directory created successfully!');
            } catch (error) {
                console.error('Directory creation error:', error);
                alert('Error creating directory: ' + error.message);
            }
        });
    }
});

window.showPage = showPage;
window.showUploadModal = showUploadModal;
window.showCreateDirectoryModal = showCreateDirectoryModal;
window.closeModal = closeModal;
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;
window.handleLogout = handleLogout;
window.loadFiles = loadFiles;
window.initializeSearch = initializeSearch;