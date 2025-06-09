let currentDirectoryId = null;

class AuthService {
    static async login(username, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Important for cookies
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        const data = await response.json();
        
        // Store user data in localStorage for persistence
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
            
            return response.json();
        } catch (error) {
            throw error;
        }
    }
}


// Page navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

// File Management Functions
async function loadFiles(directoryId = null) {
    try {
        currentDirectoryId = directoryId; // Update current directory
        const response = await fetch(`/api/files/directory/${directoryId || ''}`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load files');
        
        const data = await response.json();
        renderFilesList(data);
        updateBreadcrumb(directoryId); // Add this if you want breadcrumb navigation
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

        document.getElementById('usedStorage').textContent = usedGB;
        document.getElementById('totalStorage').textContent = totalGB;
        document.getElementById('storageUsed').style.width = `${percentage}%`;
    } catch (error) {
        console.error('Error updating storage info:', error);
    }
}

// function updateBreadcrumb(path) {
//     const breadcrumb = document.getElementById('currentPath');
//     breadcrumb.innerHTML = `
//         <i class="fas fa-home"></i>
//         ${path.map((item, index) => `
//             <span class="breadcrumb-separator">/</span>
//             <span class="breadcrumb-item" 
//                   onclick="loadFiles('${item.id}')"
//                   style="cursor: pointer">
//                 ${item.name}
//             </span>
//         `).join('')}
//     `;
// }

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

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is already logged in
    try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.user) {
                updateUIForAuthState(data.user);
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

    // Login form handler
    const loginForm = document.querySelector('#login form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const response = await AuthService.login(username, password);
            if (response.success) {
                updateUIForAuthState(response.user);
                showPage('dashboard');
                loginForm.reset();
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });

    // Register form handler
    const registerForm = document.querySelector('#register form');
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

    // Upload Form Handler
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('uploadFile', document.getElementById('fileInput').files[0]);
        
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

    // Directory Form Handler
    const directoryForm = document.getElementById('directoryForm');
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
            await loadFiles(getCurrentDirectoryId()); // Reload current directory
            directoryForm.reset();
            alert('Directory created successfully!');
        } catch (error) {
            console.error('Directory creation error:', error);
            alert('Error creating directory: ' + error.message);
        }
    });
});

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
        
        // Import the search utilities
        const { handleSearch } = await import('./utils/fileSearch.js');
        
        // Initialize search handler
        handleSearch(searchInput, searchResults, files);
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

function getCurrentDirectoryId() {
    return currentDirectoryId;
}

// UI State Management
function updateUIForAuthState(user) {
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const usernameDisplay = document.getElementById('username-display');
    const dashboardPage = document.getElementById('dashboard');
    const homePage = document.getElementById('home');
    const loginPage = document.getElementById('login');
    const registerPage = document.getElementById('register');
    const aboutPage = document.getElementById('about');

    if (user) {
        // Hide all guest-related elements
        guestNav.style.display = 'none';
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        aboutPage.style.display = 'none';

        // Show user-related elements
        userNav.style.display = 'flex';
        dashboardPage.style.display = 'block';
        usernameDisplay.textContent = user.username;

        // Load user's files
        loadFiles();
    } else {
        // Show guest elements
        guestNav.style.display = 'flex';
        homePage.style.display = 'block';

        // Hide user elements
        userNav.style.display = 'none';
        dashboardPage.style.display = 'none';
        usernameDisplay.textContent = '';

        // Hide other pages
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        aboutPage.style.display = 'none';
    }
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

    if (user) {
        // Hide all guest-related elements
        guestNav.style.display = 'none';
        homePage.style.display = 'none';
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        aboutPage.style.display = 'none';

        // Show user-related elements
        userNav.style.display = 'flex';
        dashboardPage.style.display = 'block';
        usernameDisplay.textContent = user.username;

        // Initialize search functionality
        initializeSearch();

        // Load user's files
        loadFiles();
    } else {
        // Show guest elements
        guestNav.style.display = 'flex';
        homePage.style.display = 'block';

        // Hide user elements
        userNav.style.display = 'none';
        dashboardPage.style.display = 'none';
        usernameDisplay.textContent = '';

        // Hide other pages
        loginPage.style.display = 'none';
        registerPage.style.display = 'none';
        aboutPage.style.display = 'none';
    }
}

// Modal Management
function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function showCreateDirectoryModal() {
    document.getElementById('directoryModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// File Operations
async function downloadFile(fileId) {
    try {
        const response = await fetch(`/api/files/download/${fileId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Download failed');
        }

        // Get the filename from the Content-Disposition header
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
        
        // Reload the files list after successful deletion
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

function handleSuccessfulLogin(userData) {
    updateUIForAuthState(userData);
}

function renderFilesList(files) {
    const filesList = document.getElementById('filesList');
    if (!files.items || files.items.length === 0) {
        filesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>This folder is empty</p>
            </div>
        `;
        return;
    }

    filesList.innerHTML = files.items.map(file => `
        <div class="file-item">
            <div class="file-name">
                <i class="fas ${file.type === 'directory' ? 'fa-folder' : 'fa-file'}"></i>
                ${file.name}
            </div>
            <div>${new Date(file.lastModified).toLocaleDateString()}</div>
            <div>${file.type === 'directory' ? '--' : formatFileSize(file.size)}</div>
            <div class="file-actions">
                ${file.type === 'directory' ? 
                    `<button class="action-button" onclick="loadFiles('${file._id}')">
                        <i class="fas fa-folder-open"></i> Open
                    </button>` :
                    `<button class="action-button" onclick="downloadFile('${file._id}')">
                        <i class="fas fa-download"></i> Download
                    </button>`
                }
                <button class="action-button delete-btn" onclick="deleteFile('${file._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
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

// Make functions available globally
window.showPage = showPage;
window.showUploadModal = showUploadModal;
window.showCreateDirectoryModal = showCreateDirectoryModal;
window.closeModal = closeModal;
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;
window.handleLogout = handleLogout;
window.loadFiles = loadFiles;
window.initializeSearch = initializeSearch;