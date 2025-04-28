// Types for file system representation
interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

// Search result type
interface SearchResult {
  path: string;
  name: string;
  isDirectory: boolean;
}

// Main file search class
class FileSearch {
  private rootDir: FileNode;
  private searchResults: SearchResult[] = [];
  private onResultsUpdate: (results: SearchResult[]) => void;

  constructor(
    rootDir: FileNode,
    onResultsUpdate: (results: SearchResult[]) => void
  ) {
    this.rootDir = rootDir;
    this.onResultsUpdate = onResultsUpdate;
  }

  // Main search method
  public search(pattern: string): void {
    this.searchResults = [];

    const trimmedPattern = pattern.trim();
    if (!trimmedPattern) {
      this.onResultsUpdate(this.searchResults);
      return;
    }

    const pathParts = trimmedPattern.split('/').filter(part => part.length > 0);
    const searchTerm = (pathParts.pop() || '').toLowerCase();
    const pathPrefix = pathParts.join('/').toLowerCase();

    this.searchNode(this.rootDir, searchTerm, pathPrefix);
    this.onResultsUpdate(this.searchResults);
  }

  // Recursive search through file tree
  private searchNode(node: FileNode, searchTerm: string, pathPrefix: string): void {
    const nodePathLower = node.path.toLowerCase();
    const nodeNameLower = node.name.toLowerCase();

    const matchesName = nodeNameLower.includes(searchTerm);
    const matchesPath = !pathPrefix || nodePathLower.startsWith('/' + pathPrefix);

    if (matchesName && matchesPath) {
      this.searchResults.push({
        path: node.path,
        name: node.name,
        isDirectory: node.isDirectory
      });
    }

    node.children?.forEach(child => this.searchNode(child, searchTerm, pathPrefix));
  }
}

// Mock file system based on project structure
const mockFileSystem: FileNode = {
  name: 'root',
  path: '/',
  isDirectory: true,
  children: [
    { name: 'nodemon.json', path: '/nodemon.json', isDirectory: false },
    { name: 'package.json', path: '/package.json', isDirectory: false },
    {
      name: 'public',
      path: '/public',
      isDirectory: true,
      children: [
        { name: 'index.ts', path: '/public/index.ts', isDirectory: false }
      ]
    },
    { name: 'README.md', path: '/README.md', isDirectory: false },
    {
      name: 'src',
      path: '/src',
      isDirectory: true,
      children: [
        { name: 'app.ts', path: '/src/app.ts', isDirectory: false },
        {
          name: 'config',
          path: '/src/config',
          isDirectory: true,
          children: [
            { name: 'db.ts', path: '/src/config/db.ts', isDirectory: false }
          ]
        },
        {
          name: 'controllers',
          path: '/src/controllers',
          isDirectory: true,
          children: [
            { name: 'fileController.ts', path: '/src/controllers/fileController.ts', isDirectory: false }
          ]
        },
        {
          name: 'db',
          path: '/src/db',
          isDirectory: true,
          children: [
            { name: 'connection.ts', path: '/src/db/connection.ts', isDirectory: false },
            { name: 'dbInit.ts', path: '/src/db/dbInit.ts', isDirectory: false }
          ]
        },
        {
          name: 'middlewares',
          path: '/src/middlewares',
          isDirectory: true,
          children: [
            { name: 'errorHandler.ts', path: '/src/middlewares/errorHandler.ts', isDirectory: false }
          ]
        },
        {
          name: 'models',
          path: '/src/models',
          isDirectory: true,
          children: [
            { name: 'fileModel.ts', path: '/src/models/fileModel.ts', isDirectory: false },
            { name: 'storageQuotaModel.ts', path: '/src/models/storageQuotaModel.ts', isDirectory: false },
            { name: 'userModel.ts', path: '/src/models/userModel.ts', isDirectory: false }
          ]
        },
        {
          name: 'routes',
          path: '/src/routes',
          isDirectory: true,
          children: [
            { name: 'fileRoutes.ts', path: '/src/routes/fileRoutes.ts', isDirectory: false }
          ]
        },
        { name: 'server.ts', path: '/src/server.ts', isDirectory: false },
        {
          name: 'utils',
          path: '/src/utils',
          isDirectory: true,
          children: [
            { name: 'logger.ts', path: '/src/utils/logger.ts', isDirectory: false }
          ]
        }
      ]
    },
    { name: 'tsconfig.json', path: '/tsconfig.json', isDirectory: false }
  ]
};

// Example integration with a UI component
class SearchUI {
  private fileSearch: FileSearch;
  private searchInput: HTMLInputElement;
  private resultsContainer: HTMLElement;
  private noResultsText: string;
  private debounceTimeoutId: number | undefined;

  constructor(
    rootDir: FileNode,
    searchInputId: string,
    resultsContainerId: string,
    noResultsText = 'No results found'
  ) {
    this.searchInput = document.getElementById(searchInputId) as HTMLInputElement;
    this.resultsContainer = document.getElementById(resultsContainerId) as HTMLElement;
    this.noResultsText = noResultsText;

    this.fileSearch = new FileSearch(rootDir, this.updateResults.bind(this));

    this.searchInput.addEventListener('input', this.debounceInput.bind(this));
  }

  private debounceInput(): void {
    if (this.debounceTimeoutId) {
      clearTimeout(this.debounceTimeoutId);
    }
    this.debounceTimeoutId = window.setTimeout(() => {
      this.fileSearch.search(this.searchInput.value);
    }, 200);
  }

  private updateResults(results: SearchResult[]): void {
    this.resultsContainer.innerHTML = '';
  
    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.textContent = this.noResultsText;
      noResults.className = 'dropdown-item';
      this.resultsContainer.appendChild(noResults);
      return;
    }
  
    // Separate directories and files
    const directories = results.filter(result => result.isDirectory);
    const files = results.filter(result => !result.isDirectory);
  
    // Create directory section
    if (directories.length > 0) {
      const dirHeader = document.createElement('div');
      dirHeader.className = 'dropdown-item header';
      dirHeader.textContent = 'Directories:';
      dirHeader.style.fontWeight = 'bold';
      this.resultsContainer.appendChild(dirHeader);
  
      directories.forEach(result => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
  
        const namePath = document.createElement('span');
        namePath.textContent = `📁 ${result.name} (${result.path})`;
  
        const depth = result.path.split('/').length - 2; // Subtract 2 to account for root and first folder
        item.style.marginLeft = `${depth * 10}px`; // Adjust 10px for each level
        item.appendChild(namePath);
        this.resultsContainer.appendChild(item);
      });
    }
  
    // Create file section
    if (files.length > 0) {
      const fileHeader = document.createElement('div');
      fileHeader.className = 'dropdown-item header';
      fileHeader.textContent = 'Files:';
      fileHeader.style.fontWeight = 'bold';
      this.resultsContainer.appendChild(fileHeader);
  
      files.forEach(result => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
  
        const namePath = document.createElement('span');
        namePath.textContent = `📄 ${result.name} (${result.path})`;
  
        const depth = result.path.split('/').length - 2; // Subtract 2 to account for root and first folder
        item.style.marginLeft = `${depth * 10}px`; // Adjust 10px for each level
        item.appendChild(namePath);
        this.resultsContainer.appendChild(item);
      });
    }
  }
  
}

// Initialize search
function initializeSearch(): void {
  new SearchUI(
    mockFileSystem,
    'search-input',
    'search-results'
  );
}

// Export for use in other modules
export { FileSearch, SearchUI, initializeSearch, FileNode, SearchResult };