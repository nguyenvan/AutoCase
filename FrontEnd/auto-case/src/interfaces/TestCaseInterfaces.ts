// src/interfaces/TestCaseInterfaces.ts

export interface ITestCaseListItem {
    _id: string;
    name: string;
    description?: string;
    createdAt: string; // Dùng string, sẽ format sau
    updatedAt: string;
}