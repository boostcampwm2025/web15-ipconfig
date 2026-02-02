export abstract class StorageAdapter {
  /**
   * 키에 해당하는 바이너리 데이터를 조회합니다.
   * @param key 저장소 키
   * @returns 데이터가 있으면 Buffer(Uint8Array), 없으면 null
   */
  abstract get(key: string): Promise<Uint8Array | null>;

  /**
   * 키에 바이너리 데이터를 저장합니다.
   * @param key 저장소 키
   * @param data 저장할 바이너리 데이터
   */
  abstract set(key: string, data: Uint8Array): Promise<void>;

  /**
   * 키에 해당하는 데이터를 삭제합니다.
   * @param key 저장소 키
   */
  abstract delete(key: string): Promise<void>;
}
