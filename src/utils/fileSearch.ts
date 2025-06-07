import type { IFile } from "../models/fileModel.js"; // Импортиране на интерфейса IFile като тип
import mongoose from "mongoose"; // Импортиране на mongoose за тип ObjectId
/**
 * Функция за търсене на файлове по зададен шаблон.
 * @param files - Списък от файлове, в който се извършва търсенето.
 * @param pattern - Шаблон за търсене (може да бъде част от името или пълния път).
 * @returns Списък от файлове, които съответстват на шаблона за търсене.
 */
export function searchFiles(files: Partial<IFile>[], pattern: string): Partial<IFile>[] {
  const searchTerm = pattern.trim().toLowerCase(); // Премахване на празни пространства и преобразуване в малки букви
  if (!searchTerm) return []; // Ако шаблонът е празен, връща празен списък

  // Проверка дали шаблонът съдържа '/'
  if (searchTerm.includes('/')) {
    // Филтриране по пълния път
    return files.filter(file => file.path?.toLowerCase().includes(searchTerm));
  }

  // Филтриране по име на файл
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

    // Изчистване на предишния таймаут
    clearTimeout(debounceTimeout);

    // Задаване на нов таймаут за забавяне на търсенето
    debounceTimeout = window.setTimeout(() => {
      if (searchTerm) {
        const results = searchFiles(files, searchTerm); // Извикване на функцията за търсене
        renderResults(results, resultsContainer); // Рендиране на резултатите
        resultsContainer.classList.add('active');
      } else {
        resultsContainer.classList.remove('active');
        resultsContainer.innerHTML = ''; // Изчистване на резултатите
      }
    }, 300); // Забавяне от 300ms
  });
};