import React, { useCallback, useState } from 'react';
import {
  LuShare2,
  LuFileText,
  LuMousePointer2,
  LuLayers,
  LuGamepad2,
  LuTrash2,
  LuX,
  LuCopy,
  LuCheck,
  LuClock,
  LuZap,
  LuZoomIn,
  LuZoomOut,
  LuGithub,
} from 'react-icons/lu';
import TechStackModal from '../features/widgets/techStack/components/modal/TechStackModal';

// --- Types ---

type WidgetType = 'tech';

interface WidgetPosition {
  x: number;
  y: number;
}

interface WidgetData {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  content: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  color: string; // Tailwind color class (e.g. 'bg-purple-500')
  textColor: string; // e.g. 'text-purple-500'
  style: string;
  time: string;
  status: string;
  activity: number[]; // Array for graph height
}

// --- Mock Data ---

const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'as-zini',
    role: 'Frontend',
    color: 'bg-purple-500',
    textColor: 'text-purple-500',
    style: 'Morning Person',
    time: '10 AM - 6 PM',
    status: '준비중',
    activity: [30, 80, 40, 20, 90],
  },
  {
    id: 'u2',
    name: 'Grit03',
    role: 'Backend',
    color: 'bg-teal-500',
    textColor: 'text-teal-500',
    style: 'Night Owl',
    time: '2 PM - 10 PM',
    status: '준비중',
    activity: [10, 20, 90, 80, 60],
  },
  {
    id: 'u3',
    name: 'davidpro08',
    role: 'PM',
    color: 'bg-pink-500',
    textColor: 'text-pink-500',
    style: 'Flexible',
    time: '9 AM - 6 PM',
    status: '준비완료',
    activity: [50, 50, 50, 50, 50],
  },
  {
    id: 'u3',
    name: 'snailw',
    role: 'PM',
    color: 'bg-green-500',
    textColor: 'text-pink-500',
    style: 'Flexible',
    time: '9 AM - 6 PM',
    status: '준비완료',
    activity: [50, 50, 50, 50, 50],
  },
];

// Updated to use Official Icons (Simple Icons CDN)
const TECH_OPTIONS = [
  { id: 'React', url: 'https://cdn.simpleicons.org/react/61DAFB' },
  { id: 'Vue', url: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
  { id: 'Next', url: 'https://cdn.simpleicons.org/nextdotjs/ffffff' },
  { id: 'Node', url: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { id: 'Nest', url: 'https://cdn.simpleicons.org/nestjs/E0234E' },
  { id: 'Java' },
  { id: 'Python', url: 'https://cdn.simpleicons.org/python/3776AB' },
  { id: 'AWS' },
];

// --- Components ---

function WorkSpacePage() {
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(true);
  // Global State
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [techStack, setTechStack] = useState<Set<string>>(new Set(['React']));

  // UI State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });

  // Dragging State
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // --- Handlers ---

  const addWidget = (type: WidgetType) => {
    const id = Date.now().toString();
    const x = Math.random() * 400 + 100;
    const y = Math.random() * 200 + 100;
    setWidgets([...widgets, { id, type, position: { x, y }, content: '' }]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id));
  };

  // Tech Stack Modal Handler
  const handleModalClose = useCallback(() => {
    setIsTechStackModalOpen(false);
  }, []);

  // Drag Logic
  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    x: number,
    y: number,
  ) => {
    e.stopPropagation(); // Prevent canvas drag
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      setWidgets(
        widgets.map((w) => {
          if (w.id === draggingId) {
            return {
              ...w,
              position: {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
              },
            };
          }
          return w;
        }),
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Tech Stack Logic
  const toggleTech = (techId: string) => {
    const newStack = new Set(techStack);
    if (newStack.has(techId)) newStack.delete(techId);
    else newStack.add(techId);
    setTechStack(newStack);
  };

  // User Hover Logic
  const handleUserHover = (e: React.MouseEvent, user: User) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: Math.min(rect.top, window.innerHeight - 250), // Prevent bottom overflow
      left: rect.left - 280, // Show to the left
    });
    setHoveredUser(user);
  };

  // Markdown Generation
  const generateMarkdown = () => {
    const techs = Array.from(techStack)
      .map((t) => `| ${t} | vLatest | Selected |`)
      .join('\n');

    return `# 🚀 Project Team Align Report
> Created at: ${new Date().toLocaleString()}


## 2. 🛠 Tech Stack Selection
| Tech Name | Version | Status |
| :--- | :--- | :--- |
${techs.length ? techs : '| None | - | - |'}

---
*Generated by TeamConfig*`;
  };

  return (
    <div
      className="dark flex h-screen flex-col overflow-hidden bg-gray-900 font-sans text-gray-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Hide Scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 1. Header */}
      <header className="z-50 flex h-16 shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800 px-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-xl font-bold text-white shadow-lg shadow-purple-500/20">
            15
          </div>
          <div>
            <input
              type="text"
              defaultValue="web-15-demo"
              className="w-64 border-none bg-transparent p-0 text-lg font-bold text-white transition-colors outline-none hover:text-teal-400 focus:ring-0"
            />
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              Saved just now
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex transform items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-500"
          >
            <LuFileText size={16} />
            문서 내보내기
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex transform items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-500"
          >
            <LuGithub size={16} />
            레포지토리 초기 세팅하기
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* 2. Left Toolbar */}
        <aside className="z-40 flex w-16 shrink-0 flex-col items-center gap-6 border-r border-gray-700 bg-gray-800 py-6">
          <div className="flex flex-col gap-4">
            <ToolButton
              icon={<LuMousePointer2 size={20} />}
              label="Select"
              active
            />

            <div className="h-px w-8 bg-gray-700" />

            <ToolButton
              icon={<LuLayers size={20} />}
              label="기술 스택"
              onClick={() => addWidget('tech')}
            />

            <div className="h-px w-8 bg-gray-700" />

            <ToolButton
              icon={<LuGamepad2 size={20} />}
              label="Game (Soon)"
              disabled
            />
          </div>
        </aside>

        {/* 3. Canvas Area */}
        <main className="scrollbar-hide relative flex-1 cursor-grab overflow-auto bg-gray-900 active:cursor-grabbing">
          {/* Background Pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              width: '2000px',
              height: '2000px',
            }}
          />

          {/* Widgets Rendering */}
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="animate-pop-in absolute rounded-xl shadow-2xl"
              style={{
                left: widget.position.x,
                top: widget.position.y,
                zIndex: draggingId === widget.id ? 50 : 10,
              }}
              onMouseDown={(e) =>
                handleMouseDown(
                  e,
                  widget.id,
                  widget.position.x,
                  widget.position.y,
                )
              }
            >
              {widget.type === 'tech' && (
                <TechWidget
                  onRemove={() => removeWidget(widget.id)}
                  selected={techStack}
                  onToggle={toggleTech}
                />
              )}
            </div>
          ))}
        </main>

        {/* 4. Right Sidebar */}
        <aside className="relative z-40 flex w-72 shrink-0 flex-col border-l border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-700 p-4">
            <h3 className="text-sm font-bold text-gray-300">AGENDA</h3>
            <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
              00:12:45
            </span>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            {/* Timeline */}
            <div className="relative space-y-8 border-l-2 border-gray-700 pl-4">
              <div className="relative">
                <div className="absolute -left-[21px] h-3 w-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]"></div>
                <h4 className="mb-1 text-sm font-bold text-white">
                  1. Ice Breaking
                </h4>
                <p className="text-xs text-gray-400">성향 파악 및 자기소개</p>
              </div>
              <div className="relative opacity-50">
                <div className="absolute -left-[21px] h-3 w-3 rounded-full border-2 border-gray-900 bg-gray-600"></div>
                <h4 className="mb-1 text-sm font-bold text-gray-300">
                  2. Ground Rules
                </h4>
                <p className="text-xs text-gray-500">
                  기술 스택 및 컨벤션 확정
                </p>
              </div>
              <div className="relative opacity-50">
                <div className="absolute -left-[21px] h-3 w-3 rounded-full border-2 border-gray-900 bg-gray-600"></div>
                <h4 className="mb-1 text-sm font-bold text-gray-300">
                  3. Ideation
                </h4>
                <p className="text-xs text-gray-500">기능 정의 및 우선순위</p>
              </div>
            </div>

            {/* User List */}
            <div className="mt-auto border-t border-gray-700 pt-6">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-400 uppercase">
                  Team Members ({INITIAL_USERS.length})
                </h4>
              </div>

              <ul className="space-y-2">
                <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-gray-700 py-1">
                  <LuShare2 />
                  <div className="flex h-8 items-center text-sm font-semibold">
                    초대하기
                  </div>
                </button>
                {INITIAL_USERS.map((user) => (
                  <li
                    key={user.id}
                    className="group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-700"
                    onMouseEnter={(e) => handleUserHover(e, user)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center text-xs font-bold text-gray-900`}
                    >
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-200">
                        {user.name}
                      </div>
                      <div
                        className={`text-xs ${
                          user.status === '준비중'
                            ? 'text-gray-500'
                            : user.textColor
                        }`}
                      >
                        {user.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* User Hover Card Popover */}
        {hoveredUser && (
          <div
            className="animate-slide-in pointer-events-none fixed z-100 w-64 rounded-xl border border-gray-600 bg-gray-800 p-4 shadow-2xl"
            style={{
              top: hoverPosition.top,
              left: hoverPosition.left,
            }}
          >
            <div className="mb-3 flex items-start gap-4">
              <div
                className={`h-12 w-12 rounded-full ${hoveredUser.color} flex items-center justify-center text-lg font-bold text-gray-900`}
              >
                {hoveredUser.name[0]}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {hoveredUser.name}
                </h4>
                <span className="rounded-full border border-gray-600 bg-gray-700 px-2 py-0.5 text-xs text-blue-400">
                  {hoveredUser.role}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <LuClock className="text-gray-500" size={14} />
                <span>{hoveredUser.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <LuZap className="text-yellow-400" size={14} />
                <span>{hoveredUser.style}</span>
              </div>
            </div>
            <div className="mt-3 border-t border-gray-700 pt-3">
              <div className="mb-1 text-[10px] tracking-wide text-gray-500 uppercase">
                Activity
              </div>
              <div className="flex h-8 items-end gap-1">
                {hoveredUser.activity.map((height, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm ${
                      i % 2 === 0 ? 'bg-gray-600' : 'bg-teal-500'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
            <button className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">
              <LuZoomOut size={14} />
            </button>
            <span className="px-2 font-mono text-xs text-gray-300">100%</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-r-lg text-gray-400 hover:bg-gray-700 hover:text-white">
              <LuZoomIn size={14} />
            </button>
          </div>
        </div>
        {isTechStackModalOpen && (
          <TechStackModal onModalClose={handleModalClose} />
        )}
      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="animate-scale-in flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-gray-700 bg-gray-800 shadow-2xl">
            <div className="flex items-center justify-between rounded-t-xl border-b border-gray-700 bg-gray-900 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-800 p-2">
                  <LuFileText className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Export to README.md
                  </h3>
                  <p className="text-xs text-gray-400">
                    GitHub 위키나 README에 바로 붙여넣으세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                <LuX size={24} />
              </button>
            </div>

            <div className="group relative flex-1 overflow-auto bg-[#0d1117] p-0">
              <div className="absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(generateMarkdown())
                  }
                  className="flex items-center gap-2 rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-xs text-white shadow-lg hover:bg-gray-600"
                >
                  <LuCopy size={12} /> Copy Raw
                </button>
              </div>
              <pre className="p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300 selection:bg-blue-500 selection:text-white">
                {generateMarkdown()}
              </pre>
            </div>

            <div className="flex justify-end gap-3 rounded-b-xl border-t border-gray-700 bg-gray-800 p-4">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateMarkdown());
                  alert('Copied to clipboard!');
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500"
              >
                <LuCheck size={16} />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Sub Components ---

interface ToolButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

const ToolButton = ({
  icon,
  label,
  onClick,
  active,
  disabled,
}: ToolButtonProps) => (
  <div className="group relative flex items-center justify-center">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
        active
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
    >
      {icon}
    </button>
    {label && (
      <span className="pointer-events-none absolute left-14 z-50 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    )}
  </div>
);

// 2. Tech Widget
interface TechWidgetProps {
  onRemove: () => void;
  selected: Set<string>;
  onToggle: (techId: string) => void;
}
const TechWidget = ({ onRemove, selected, onToggle }: TechWidgetProps) => (
  <div className="w-[400px] cursor-auto rounded-xl border border-gray-700 bg-gray-800 p-5">
    <WidgetHeader
      title="Tech Stack"
      icon={<LuLayers className="text-purple-400" size={18} />}
      onRemove={onRemove}
    />
    <div className="grid grid-cols-4 gap-3">
      {TECH_OPTIONS.map((tech) => (
        <button
          key={tech.id}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onToggle(tech.id)}
          className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border transition-all ${
            selected.has(tech.id)
              ? 'border-blue-500 bg-gray-700 ring-1 ring-blue-500'
              : 'border-gray-600 bg-gray-800 hover:border-blue-400 hover:bg-gray-700'
          } `}
        >
          {tech.url && (
            <img src={tech.url} alt={tech.id} className="mb-1 h-6 w-6" />
          )}
          <span
            className={`text-[10px] ${
              selected.has(tech.id) ? 'text-blue-300' : 'text-gray-400'
            }`}
          >
            {tech.id}
          </span>
        </button>
      ))}
    </div>
  </div>
);

interface WidgetHeaderProps {
  title: string;
  icon: React.ReactNode;
  onRemove: () => void;
}
const WidgetHeader = ({ title, icon, onRemove }: WidgetHeaderProps) => (
  <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2 select-none">
    <h4 className="flex items-center gap-2 font-bold text-white">
      {icon} {title}
    </h4>
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onRemove}
      className="text-gray-500 transition-colors hover:text-red-400"
    >
      <LuTrash2 size={16} />
    </button>
  </div>
);

export default WorkSpacePage;
