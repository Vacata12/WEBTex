// Export the function declaration directly
export function showPage(pageId: string): void {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        (page as HTMLElement).style.display = 'none';
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
}

// Type declaration for global usage
declare global {
    interface Window {
        showPage: typeof showPage;
    }
}

window.showPage = showPage;