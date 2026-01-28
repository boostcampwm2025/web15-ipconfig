import { WorkspaceService } from '../workspace.service';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  beforeEach(() => {
    service = new WorkspaceService();
  });

  it('워크스페이스를 생성하고 존재 여부를 확인할 수 있다', () => {
    expect(service.isExistsWorkspace('room-1')).toBe(false);

    service.createWorkspace('room-1');

    expect(service.isExistsWorkspace('room-1')).toBe(true);
  });

  it('updateWorkspace 호출 시 만료 시간이 연장된다', () => {
    service.createWorkspace('room-2');

    // 내부 만료 시간을 확인하기 위해 any 캐스팅
    const workspaces = (
      service as unknown as {
        workspaces: Map<string, { expirationTime: Date }>;
      }
    ).workspaces as Map<string, { expirationTime: Date }>;

    const before = workspaces.get('room-2')!.expirationTime;

    service.updateWorkspace('room-2');

    const after = workspaces.get('room-2')!.expirationTime;

    expect(after.getTime()).toBeGreaterThan(before.getTime());
  });

  it('만료된 워크스페이스를 삭제한다', () => {
    // 과거 시점으로 만료된 워크스페이스를 직접 주입
    const workspaces = (
      service as unknown as {
        workspaces: Map<string, { expirationTime: Date }>;
      }
    ).workspaces as Map<string, { expirationTime: Date }>;

    workspaces.set('expired-room', {
      expirationTime: new Date(Date.now() - 1000),
    });

    expect(service.isExistsWorkspace('expired-room')).toBe(true);
    service.deleteWorkspace('expired-room');
    expect(service.isExistsWorkspace('expired-room')).toBe(false);
  });
});
