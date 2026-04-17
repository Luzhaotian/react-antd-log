import { get, post, put, del } from '@/utils/request'
import type { FileRenameItemDTO, CreateFileRenameParams } from '@/types'

const BASE_URL = '/api/file-rename/items'

export async function getFileRenameList(): Promise<FileRenameItemDTO[]> {
  return get<FileRenameItemDTO[]>(BASE_URL)
}

export async function createFileRenameItem(
  params: CreateFileRenameParams
): Promise<FileRenameItemDTO> {
  return post<FileRenameItemDTO>(BASE_URL, params)
}

export async function updateFileRenameItem(
  id: number,
  params: CreateFileRenameParams
): Promise<FileRenameItemDTO> {
  return put<FileRenameItemDTO>(`${BASE_URL}/${id}`, params)
}

export async function deleteFileRenameItem(id: number): Promise<void> {
  return del(`${BASE_URL}/${id}`)
}

export async function batchDeleteFileRenameItems(ids: number[]): Promise<void> {
  return del(`${BASE_URL}/batch`, { ids })
}

export async function deleteAllFileRenameItems(): Promise<void> {
  return del(`${BASE_URL}/all`)
}
