import type { IFile } from "../models/fileModel.js";
import mongoose from "mongoose";
/**
 * Функция за търсене на файлове по зададен шаблон.
 * @param files - Списък от файлове, в който се извършва търсенето.
 * @param pattern - Шаблон за търсене (може да бъде част от името или пълния път).
 * @returns Списък от файлове, които съответстват на шаблона за търсене.
 */
export function searchFiles(files: Partial<IFile>[], pattern: string): Partial<IFile>[] {
  const searchTerm = pattern.trim().toLowerCase(); 
  if (!searchTerm) return []; 

  
  if (searchTerm.includes('/')) {
    
    return files.filter(file => file.path?.toLowerCase().includes(searchTerm));
  }

  
  return files.filter(file => file.name?.toLowerCase().includes(searchTerm));
}

/**
 * Функция за рендиране на резултатите от търсенето.
 * @param results - Списък от файлове, които съответстват на шаблона за търсене.
 * @param resultsContainer - HTML елемент, в който ще се показват резултатите.
 */
export const renderResults = (results: Partial<IFile>[], resultsContainer: HTMLElement): void => {
  resultsContainer.innerHTML = ''; // Изчистване на предишните резултати
  results.forEach(file => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.innerHTML = `
      <strong>${file.name}</strong> (${file.type})<br>
      <small>Path: ${file.path}</small><br>
      <small>Size: ${file.size || 'N/A'} bytes</small><br>
      <small>Last Modified: ${new Date(file.lastModified!).toLocaleString()}</small>
    `;
    resultsContainer.appendChild(item);
  });
};

/**
 * Функция за обработка на търсенето с debounce.
 * @param searchInput - HTML елемент за въвеждане на шаблон за търсене.
 * @param resultsContainer - HTML елемент, в който ще се показват резултатите.
 * @param files - Списък от файлове, в който ще се извършва търсенето.
 */
export const handleSearch = (
  searchInput: HTMLInputElement,
  resultsContainer: HTMLElement,
  files: Partial<IFile>[]
): void => {
  let debounceTimeout: number;

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();

    
    clearTimeout(debounceTimeout);

    
    debounceTimeout = window.setTimeout(() => {
      if (searchTerm) {
        const results = searchFiles(files, searchTerm); 
        renderResults(results, resultsContainer); 
        resultsContainer.classList.add('active');
      } else {
        resultsContainer.classList.remove('active');
        resultsContainer.innerHTML = '';
      }
    }, 300); // Забавяне от 300ms
  });
};