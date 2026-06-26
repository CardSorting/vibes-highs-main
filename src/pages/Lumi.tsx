import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Shield, CheckCircle2, Cpu, Sliders, Code2, 
  Sparkles, Command, Workflow, Copy, Check, ExternalLink, 
  ChevronRight, Info, AlertTriangle, Layers, GitBranch, 
  HelpCircle, Activity, Play, Zap, FileText, Lock, BookOpen, 
  Heart, RefreshCw, X, Keyboard, GitCommit, Search,
  Folder, FolderOpen, File, Settings, ThumbsUp, ThumbsDown, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SEO from '../components/SEO';
import { GlitchText } from '@/components/GlitchText';
import { toast } from 'sonner';

interface CommitNode {
  hash: string;
  msg: string;
  time: string;
  type: 'read' | 'write' | 'checkpoint';
}

const mcpToolsList = {
  sqlite: [
    { name: 'execute_query', desc: 'Run SQL statements on database substrate', args: '{\n  "query": "SELECT * FROM memory;"\n}' },
    { name: 'read_schema', desc: 'Inspect database tables and schemas', args: '{\n  "table": "tasks"\n}' }
  ],
  github: [
    { name: 'list_pull_requests', desc: 'Fetch open pull requests from repository', args: '{\n  "repo": "DietCodeMarie",\n  "state": "open"\n}' },
    { name: 'get_commit', desc: 'Inspect specific git commit details', args: '{\n  "sha": "a1b2c3d"\n}' }
  ],
  filesystem: [
    { name: 'grep_search', desc: 'Fast ripgrep regex searching across files', args: '{\n  "pattern": "Controller",\n  "dir": "src/"\n}' },
    { name: 'read_file', desc: 'Securely inspect physical file contents', args: '{\n  "path": "src/server.ts"\n}' }
  ]
};


export default function Lumi() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'modes' | 'commands' | 'mentions' | 'hooks' | 'roadmap'>('modes');
  const [commandQuery, setCommandQuery] = useState('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState('');
  const [activePhilosophyTab, setActivePhilosophyTab] = useState<number>(0);

  // Interactive Simulator States
  const [simStep, setSimStep] = useState<number>(0); // 0: Idle, 1: Prompt Input, 2: Plan Mode, 3: Act Mode (Approve/Reject), 4: Checkpoints & Tests, 5: Completed
  const [simDiffAction, setSimDiffAction] = useState<'approved' | 'rejected' | null>(null);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState(0);
  const [yoloMode, setYoloMode] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [activeFile, setActiveFile] = useState<'server.ts' | 'package.json' | 'dietcoderules'>('server.ts');
  const [simTerminalTab, setSimTerminalTab] = useState<'terminal' | 'problems' | 'logs'>('terminal');
  const [simTerminalInput, setSimTerminalInput] = useState('');
  
  // Hook configuration policy inside playground
  const [hookType, setHookType] = useState<'PreToolUse' | 'TaskComplete' | 'UserPromptSubmit'>('PreToolUse');
  const [hookPolicy, setHookPolicy] = useState<'allow' | 'warn' | 'block'>('allow');
  const [hookLogs, setHookLogs] = useState<string[]>([]);

  // Interactive FAQ Helpfulness Votes
  const [faqVotes, setFaqVotes] = useState<Record<number, { up: number; down: number; voted: 'up' | 'down' | null }>>({
    0: { up: 42, down: 2, voted: null },
    1: { up: 18, down: 0, voted: null },
    2: { up: 31, down: 4, voted: null },
    3: { up: 55, down: 1, voted: null },
    4: { up: 27, down: 3, voted: null }
  });

  // Interactive MCP playground
  const [mcpSelectedServer, setMcpSelectedServer] = useState<'sqlite' | 'github' | 'filesystem'>('sqlite');
  const [mcpSelectedTool, setMcpSelectedTool] = useState<string>('execute_query');
  const [mcpArguments, setMcpArguments] = useState('{\n  "query": "SELECT * FROM memory;"\n}');
  const [mcpExecuting, setMcpExecuting] = useState(false);
  const [mcpResult, setMcpResult] = useState('');

  // Capabilities Console Interactive Typer States
  const [cmdInputText, setCmdInputText] = useState('');
  const [cmdRunning, setCmdRunning] = useState(false);
  const [cmdOutput, setCmdOutput] = useState<string[]>([]);

  // Substrate / BroccoliDB Snapshot Timeline States
  const [commitList, setCommitList] = useState<CommitNode[]>([
    { hash: 'a1b2c3d', msg: 'System Bootstrap: BroccoliDB spider audit active', time: '15:40:02', type: 'read' },
    { hash: 'd9f8e7a', msg: 'Shadow Git Commit: Staged .dietcodeignore configurations', time: '15:42:15', type: 'checkpoint' },
    { hash: 'ef32c91', msg: 'Substrate Sync: Initialized server workspace', time: '15:44:00', type: 'read' },
    { hash: '9a8b7c6', msg: 'Shadow Git Commit: Added api vibes router', time: '15:46:12', type: 'write' },
    { hash: '4d5e6f7', msg: 'Substrate Checkpoint: Pre-commit snapshot capture', time: '15:48:30', type: 'checkpoint' }
  ]);

  // Model Router States
  const [planProvider, setPlanProvider] = useState<'openrouter' | 'openai' | 'nous' | 'cloudflare'>('openrouter');
  const [actProvider, setActProvider] = useState<'openrouter' | 'openai' | 'nous' | 'cloudflare'>('openai');
  const [connectedMcps, setConnectedMcps] = useState<{ sqlite: boolean; github: boolean; filesystem: boolean }>({
    sqlite: true,
    github: false,
    filesystem: true
  });
  const [mcpLog, setMcpLog] = useState<string[]>([
    '[MCP Hub] Mapped schema tools: mcp:sqlite:execute_query, mcp:sqlite:read_schema',
    '[MCP Hub] Registered Local File System server. Ready.'
  ]);

  // Virtual Terminal Output
  const [simTerminalOutput, setSimTerminalOutput] = useState<string[]>([
    'MarieCoder Virtual Shell - LUMI Sandbox CLI v1.0.5',
    'Type "help" for a list of active commands.',
    ''
  ]);

  // Hovered Architecture Flowchart Node State
  const [hoveredArchNode, setHoveredArchNode] = useState<string | null>(null);

  // Keyboard hotkey simulation state references
  const simStepRef = useRef(simStep);
  const simProgressRef = useRef(simProgress);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    simStepRef.current = simStep;
  }, [simStep]);

  useEffect(() => {
    simProgressRef.current = simProgress;
  }, [simProgress]);

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simTerminalOutput]);

  // Keyboard event listener for Simulator Sandbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl && (
          activeEl.tagName === 'INPUT' || 
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.getAttribute('contenteditable') === 'true'
        )
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const currentStep = simStepRef.current;

      if (key === 'i' && currentStep === 0) {
        setSimStep(1);
      } else if (key === 'p' && currentStep === 1) {
        setSimStep(2);
      } else if (key === 'a' && currentStep === 2 && simProgressRef.current === 100) {
        handleTransitionToActMode();
      } else if (key === 'a' && currentStep === 3) {
        approveMutatingWrite();
      } else if (key === 'r' && currentStep === 3) {
        rejectMutatingWrite();
      } else if (key === 'r' && currentStep === 5) {
        resetSimulator();
      } else if (key === 'y' && currentStep === 2) {
        setYoloMode(prev => !prev);
        toast.info(yoloMode ? 'YOLO Mode Deactivated' : 'YOLO Mode Activated');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hookPolicy, hookType, yoloMode]);

  // Virtual files database
  const filesContent = {
    'server.ts': {
      original: `import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/vibes', (req, res) => {
  res.json({ vibes: 'stable', isFriday: true });
});

app.listen(PORT, () => {
  console.log(\`Server active on port \${PORT}\`);
});`,
      proposed: `import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/vibes', (req, res) => {
  res.json({ vibes: 'stable', isFriday: true });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(\`Server active on port \${PORT}\`);
});`,
      modified: `import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/vibes', (req, res) => {
  res.json({ vibes: 'stable', isFriday: true });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(\`Server active on port \${PORT}\`);
});`
    },
    'package.json': {
      original: `{
  "name": "codemarie-new",
  "version": "1.0.3",
  "private": true,
  "dependencies": {
    "@noorm/broccolidb": "^1.0.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0"
  }
}`,
      proposed: `{
  "name": "codemarie-new",
  "version": "1.0.3",
  "private": true,
  "dependencies": {
    "@noorm/broccolidb": "^1.0.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0"
  }
}`,
      modified: `{
  "name": "codemarie-new",
  "version": "1.0.3",
  "private": true,
  "dependencies": {
    "@noorm/broccolidb": "^1.0.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0"
  }
}`
    },
    'dietcoderules': {
      original: `# Rule: Gated Verification Controls
- Enforce strict typing on tool parameters.
- Run complete compile checks before attempt_completion.
- Fail closed if checks return warnings.`,
      proposed: `# Rule: Gated Verification Controls
- Enforce strict typing on tool parameters.
- Run complete compile checks before attempt_completion.
- Fail closed if checks return warnings.`,
      modified: `# Rule: Gated Verification Controls
- Enforce strict typing on tool parameters.
- Run complete compile checks before attempt_completion.
- Fail closed if checks return warnings.`
    }
  };

  // Custom regex-based runtime code tokenizer
  const highlightCodeLine = (line: string, type: 'ts' | 'json' | 'md') => {
    if (type === 'md') {
      if (line.startsWith('#')) {
        return <span className="text-primary font-black font-display">{line}</span>;
      }
      if (line.startsWith('-')) {
        return <span><span className="text-primary font-bold mr-1">&bull;</span>{line.substring(2)}</span>;
      }
      return <span className="text-white/60">{line}</span>;
    }

    if (type === 'json') {
      const parts: React.ReactNode[] = [];
      let currentIdx = 0;
      const regex = /(".*?")|(\d+|true|false|null)|([{}[\]:,])/g;
      let match;
      const text = line;
      
      while ((match = regex.exec(text)) !== null) {
        if (match.index > currentIdx) {
          parts.push(text.substring(currentIdx, match.index));
        }
        
        const [lexeme] = match;
        if (lexeme.startsWith('"')) {
          const isKey = text[match.index + lexeme.length] === ':' || text.substring(match.index + lexeme.length).trim().startsWith(':');
          if (isKey) {
            parts.push(<span key={match.index} className="text-sky-300 font-semibold">{lexeme}</span>);
          } else {
            parts.push(<span key={match.index} className="text-emerald-400">{lexeme}</span>);
          }
        } else if (/^\d+$/.test(lexeme) || lexeme === 'true' || lexeme === 'false' || lexeme === 'null') {
          parts.push(<span key={match.index} className="text-violet-400 font-bold">{lexeme}</span>);
        } else {
          parts.push(<span key={match.index} className="text-yellow-400">{lexeme}</span>);
        }
        currentIdx = regex.lastIndex;
      }
      
      if (currentIdx < text.length) {
        parts.push(text.substring(currentIdx));
      }
      
      return <>{parts.length > 0 ? parts : line}</>;
    }

    // TypeScript/JavaScript colorizer
    const keywords = ['import', 'from', 'const', 'let', 'process', 'env', 'response', 'req', 'res', 'console', 'log'];
    const regex = /(".*?"|'.*?'|`.*?`)|(\b\w+\b)|([{}()[\]:;.,=+\-*&|<>!])/g;
    const parts: React.ReactNode[] = [];
    let currentIdx = 0;
    const text = line;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > currentIdx) {
        parts.push(text.substring(currentIdx, match.index));
      }

      const [lexeme] = match;
      if (lexeme.startsWith('"') || lexeme.startsWith("'") || lexeme.startsWith('`')) {
        parts.push(<span key={match.index} className="text-emerald-400">{lexeme}</span>);
      } else if (keywords.includes(lexeme)) {
        parts.push(<span key={match.index} className="text-violet-400 font-bold">{lexeme}</span>);
      } else if (/^\d+$/.test(lexeme)) {
        parts.push(<span key={match.index} className="text-amber-400 font-bold">{lexeme}</span>);
      } else if (['express', 'app', 'PORT'].includes(lexeme)) {
        parts.push(<span key={match.index} className="text-sky-300 font-medium">{lexeme}</span>);
      } else if (['{', '}', '(', ')', '[', ']'].includes(lexeme)) {
        parts.push(<span key={match.index} className="text-yellow-200">{lexeme}</span>);
      } else {
        parts.push(lexeme);
      }
      currentIdx = regex.lastIndex;
    }

    if (currentIdx < text.length) {
      parts.push(text.substring(currentIdx));
    }

    return <>{parts.length > 0 ? parts : line}</>;
  };

  // Helper code renderer inside sandbox editor
  const getActiveCode = () => {
    if (activeFile === 'server.ts') {
      if (simStep < 3) return filesContent['server.ts'].original;
      if (simStep === 3) return filesContent['server.ts'].proposed;
      return simDiffAction === 'approved' ? filesContent['server.ts'].modified : filesContent['server.ts'].original;
    }
    return filesContent[activeFile].original;
  };

  // Helper filetype resolver
  const getActiveFileType = (): 'ts' | 'json' | 'md' => {
    if (activeFile === 'server.ts') return 'ts';
    if (activeFile === 'package.json') return 'json';
    return 'md';
  };

  // Simulator lifecycle logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simStep === 2) {
      setSimProgress(0);
      setSimLog(["[Plan Mode] Reading workspace...", "[Plan Mode] Locating file: src/server.ts", "[Plan Mode] Analyzing Express server endpoints..."]);
      
      const stepDuration = yoloMode ? 200 : 800;
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSimLog((logs) => [...logs, "[Plan Mode] Roadmap generated.", "[Plan Mode] Recommended action: Append '/health' routing block.", "[System] Prompting transition to ACT Mode."]);
            
            // If YOLO mode is enabled, auto-transition and auto-approve without waiting
            if (yoloMode) {
              setTimeout(() => {
                handleTransitionToActMode(true);
              }, 300);
            }
            return 100;
          }
          return prev + 25;
        });
      }, stepDuration);
    } else if (simStep === 4) {
      setSimProgress(0);
      setSimLog(["[Act Mode] Writing changes to src/server.ts...", "[Substrate] Capturing shadow Git snapshot...", "[Checkpoint] Snapshot hash '4d5e6f7' committed to globalStorage."]);
      
      const stepDuration = yoloMode ? 150 : 700;
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSimLog((logs) => [...logs, "[Gated completion] Running 'npm run lint'...", "[Gated completion] Running test suite...", "[Gated completion] ROADMAP.md milestone verified.", "[System] Task completed successfully."]);
            
            // Auto add check node to timeline
            const date = new Date();
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            setCommitList(prevCommits => {
              if (prevCommits.some(c => c.hash === '4d5e6f7')) return prevCommits;
              return [
                ...prevCommits,
                { hash: '4d5e6f7', msg: 'Shadow Git Commit: Added health check routing', time: timeStr, type: 'write' }
              ];
            });

            setTimeout(() => setSimStep(5), yoloMode ? 400 : 1000);
            return 100;
          }
          if (prev === 25) {
            setSimLog((logs) => [...logs, "[System] Running completionGatePipeline.ts checks..."]);
          }
          if (prev === 50) {
            setSimLog((logs) => [...logs, "[System] Auditing roadmap alignment..."]);
          }
          return prev + 25;
        });
      }, stepDuration);
    }
    return () => clearInterval(interval);
  }, [simStep, yoloMode]);

  const handleTransitionToActMode = (autoYolo = false) => {
    // Intercept check for PreToolUse hook
    if (hookType === 'PreToolUse') {
      const timestamp = new Date().toLocaleTimeString();
      if (hookPolicy === 'block') {
        toast.error(`[Hook Intercepted] PreToolUse blocked write_file tool to src/server.ts!`);
        setHookLogs(prev => [...prev, `[${timestamp}] Intercepted and BLOCKED write_file tool to src/server.ts`]);
        setSimTerminalOutput(prev => [...prev, `[Hook Block] Action aborted by policy PreToolUse = BLOCK.`]);
        return;
      } else if (hookPolicy === 'warn') {
        toast.warning(`[Hook Warning] PreToolUse intercept: write_file staged, reviewing rule parameters.`);
        setHookLogs(prev => [...prev, `[${timestamp}] Triggered warning for write_file to src/server.ts`]);
      } else {
        toast.success(`[Hook Fired] PreToolUse checklist passed.`);
        setHookLogs(prev => [...prev, `[${timestamp}] Executed PreToolUse check: ALLOWED`]);
      }
    }

    setSimStep(3);
    if (autoYolo || yoloMode) {
      setTimeout(() => {
        approveMutatingWrite();
      }, 500);
    }
  };

  const approveMutatingWrite = () => {
    setSimDiffAction('approved');
    setSimStep(4);
    toast.success('Changes approved. Applying write tools.');
  };

  const rejectMutatingWrite = () => {
    setSimDiffAction('rejected');
    toast.error('Proposed changes rejected. Reverting sandbox.');
    resetSimulator();
  };

  const resetSimulator = () => {
    setSimStep(0);
    setSimDiffAction(null);
    setSimLog([]);
    setSimProgress(0);
    setActiveFile('server.ts');
  };

  // Shadow Git Checkpoint Rollback
  const rollbackToCheckpoint = (node: CommitNode) => {
    toast.success(`Rolled back codebase to snapshot [${node.hash}]`);
    setSimTerminalOutput((prev) => [
      ...prev,
      `[Substrate] Rolling back workspace files to checkpoint [${node.hash}]...`,
      `[Substrate] Restored src/server.ts, database schemas synced.`,
      `[System] Sandbox reset to initialized state.`
    ]);
    resetSimulator();
  };

  // MCP virtual executor
  const executeMcpTest = () => {
    setMcpExecuting(true);
    setMcpResult('');
    
    setTimeout(() => {
      setMcpExecuting(false);
      if (mcpSelectedTool === 'execute_query') {
        setMcpResult(JSON.stringify([
          { id: 1, key: 'cognitive_state', val: 'gated_complete' },
          { id: 2, key: 'last_run_timestamp', val: '1781905663392' }
        ], null, 2));
      } else if (mcpSelectedTool === 'read_schema') {
        setMcpResult(JSON.stringify({
          table: 'tasks',
          columns: [
            { name: 'id', type: 'INTEGER', primaryKey: true },
            { name: 'title', type: 'TEXT' },
            { name: 'status', type: 'TEXT' }
          ]
        }, null, 2));
      } else if (mcpSelectedTool === 'list_pull_requests') {
        setMcpResult(JSON.stringify([
          { number: 104, title: 'Replaced Plan Mode provider configs', author: 'MarieCoder' }
        ], null, 2));
      } else if (mcpSelectedTool === 'get_commit') {
        setMcpResult(JSON.stringify({
          sha: 'a1b2c3d',
          message: 'System Bootstrap: BroccoliDB spider audit active',
          author: 'bozoegg',
          date: '2026-06-19T15:40:02Z'
        }, null, 2));
      } else if (mcpSelectedTool === 'grep_search') {
        setMcpResult(JSON.stringify([
          { file: 'src/server.ts', line: 12, match: 'console.log(`Server active on port ${PORT}`);' }
        ], null, 2));
      } else if (mcpSelectedTool === 'read_file') {
        setMcpResult(filesContent['server.ts'].original);
      } else {
        setMcpResult('{\n  "status": "success",\n  "message": "Mock tool response returned"\n}');
      }
    }, 800);
  };

  // Capabilities: Interactive Command Player
  const runCommandSimulation = (commandName: string) => {
    if (cmdRunning) return;
    setCmdRunning(true);
    setCmdInputText('');
    setCmdOutput([]);

    let charIdx = 0;
    const typingInterval = setInterval(() => {
      if (charIdx < commandName.length) {
        setCmdInputText((prev) => prev + commandName[charIdx]);
        charIdx++;
      } else {
        clearInterval(typingInterval);
        setCmdOutput([`Running ${commandName}...`]);
        setTimeout(() => {
          if (commandName === '/compact') {
            setCmdOutput((prev) => [
              ...prev,
              'Compressing conversation history buffer...',
              'Tokens summarized: 8,420 -> 1,200',
              'Context checkpoint committed to memory database.',
              'Status: OK - Context window refreshed.'
            ]);
          } else if (commandName === '/roadmap') {
            setCmdOutput((prev) => [
              ...prev,
              'Reading local ROADMAP.md baseline...',
              'Validating tasks: 4 milestones check out.',
              'Validation status: 100% Gated - ready for attempt_completion.'
            ]);
          } else if (commandName === '/newrule') {
            setCmdOutput((prev) => [
              ...prev,
              'Generating project constraints profile...',
              'Created file: .dietcoderules/team-rules.md',
              'Status: Saved root rule.'
            ]);
          } else {
            setCmdOutput((prev) => [
              ...prev,
              `Successfully executed ${commandName} loop.`,
              'Session state verified.'
            ]);
          }
          setCmdRunning(false);
        }, 1000);
      }
    }, 60);
  };

  // Virtual shell input interpreter
  const handleTerminalCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = simTerminalInput.trim();
    if (!input) return;

    const newLogs = [...simTerminalOutput, `$ ${input}`];
    const cmd = input.toLowerCase();
    let response: string[] = [];

    if (cmd === 'help') {
      response = [
        'LUMI Virtual Sandbox Terminal Commands:',
        '  lumi status       Show coding agent session status',
        '  lumi checkpoints  List current active shadow Git checkpoints',
        '  npm run dev       Launch hot reloading Vite dev server',
        '  clear             Clear terminal screen',
        '  help              Display this menu'
      ];
    } else if (cmd === 'lumi status') {
      response = [
        `LUMI Extension Host: v1.0.5`,
        `Session controller: ACTIVE`,
        `Substrate Sync: BroccoliDB running on SQLite3`,
        `Gated pipeline: STABLE - 0 diagnostics pending.`
      ];
    } else if (cmd === 'lumi checkpoints') {
      response = [
        `Active shadow Git snapshots:`,
        ...commitList.map(c => `  [${c.hash}] ${c.time} - ${c.msg} (${c.type.toUpperCase()})`)
      ];
    } else if (cmd === 'npm run dev') {
      response = [
        `> react-example@0.0.0 dev`,
        `> vite --port=3000`,
        `  VITE v6.2.3  ready in 250 ms`,
        `  ➜  Local:   http://localhost:3000/`,
        `  ➜  Network: use --host to expose`,
        `  [vite] hot module replacement enabled`,
        `  [lumi] connection mapped on port 3000.`
      ];
    } else if (cmd === 'clear') {
      setSimTerminalOutput([]);
      setSimTerminalInput('');
      return;
    } else {
      response = [`sh: command not found: ${input}`];
    }

    setSimTerminalOutput([...newLogs, ...response]);
    setSimTerminalInput('');
  };

  // BroccoliDB Snapshot Tree generator
  const triggerBroccoliSnapshot = () => {
    const randomHash = Math.random().toString(16).substring(2, 9);
    const msgs = [
      'Spider audited route nodes structures',
      'Captured codebase file system checkpoint',
      'Durable SQLite cognitive node initialized',
      'Spider validated export boundaries integrity'
    ];
    const types: ('read' | 'write' | 'checkpoint')[] = ['read', 'write', 'checkpoint'];
    const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const date = new Date();
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

    setCommitList((prev) => [
      ...prev,
      { hash: randomHash, msg: randomMsg, time: timeStr, type: randomType }
    ]);
    toast.success(`Audited database checkpoint hash: ${randomHash}`);
  };

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    toast.success('Command copied to clipboard');
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const toggleMcpServer = (key: 'sqlite' | 'github' | 'filesystem') => {
    const isNowConnected = !connectedMcps[key];
    setConnectedMcps((prev) => ({ ...prev, [key]: isNowConnected }));
    const serverName = key === 'sqlite' ? 'SQLite DB' : key === 'github' ? 'GitHub API' : 'Local File System';
    
    if (isNowConnected) {
      setMcpLog((prev) => [
        ...prev,
        `[MCP Hub] Connecting to mcp://${key}-server...`,
        `[MCP Hub] Mapped schema tools: mcp:${key}:schema, mcp:${key}:query`,
        `[MCP Hub] Registered ${serverName} server. Ready.`
      ]);
      toast.success(`Connected to mcp://${key}-server`);
    } else {
      setMcpLog((prev) => [
        ...prev,
        `[MCP Hub] Terminated connection to mcp://${key}-server.`
      ]);
      toast.error(`Disconnected from mcp://${key}-server`);
    }
  };

  // FAQ Feedback Rating
  const handleFaqVote = (idx: number, type: 'up' | 'down') => {
    setFaqVotes((prev) => {
      const current = prev[idx];
      if (current.voted === type) {
        return {
          ...prev,
          [idx]: {
            ...current,
            up: type === 'up' ? current.up - 1 : current.up,
            down: type === 'down' ? current.down - 1 : current.down,
            voted: null
          }
        };
      }
      
      let newUp = current.up;
      let newDown = current.down;
      if (current.voted === 'up') newUp--;
      if (current.voted === 'down') newDown--;
      
      if (type === 'up') newUp++;
      if (type === 'down') newDown++;
      
      return {
        ...prev,
        [idx]: {
          up: newUp,
          down: newDown,
          voted: type
        }
      };
    });
    toast.success('Thank you for your feedback!');
  };

  const installMethods = [
    {
      title: 'VS Code Marketplace',
      command: 'code --install-extension CardSorting.lumi-vscode',
      description: 'Primary extension target (CardSorting.lumi-vscode)',
      id: 'vscode',
      url: 'https://marketplace.visualstudio.com/items?itemName=CardSorting.lumi-vscode'
    },
    {
      title: 'Open VSX / Cursor',
      command: 'code --install-extension CardSorting.lumi',
      description: 'Compatible with Cursor and alternative registries (CardSorting.lumi)',
      id: 'openvsx',
      url: 'https://open-vsx.org/extension/CardSorting/lumi'
    },
    {
      title: 'VSIX Local Build',
      command: 'npm run package:vsix && code --install-extension dist/*.vsix',
      description: 'Pack and load from monorepo source files directly',
      id: 'vsix'
    }
  ];

  const pillars = [
    {
      title: 'Calm Agency',
      tagline: 'Comfort first, alert fatigue never',
      desc: 'The sidebar stays readable and quiet. Mutating work is structured into clean proposals that wait on your schedule. No flashing notifications or chaotic text blocks.',
      icon: <Activity className="text-primary" size={24} />
    },
    {
      title: 'Typed Tools',
      tagline: 'Dedicated handlers, no raw shell',
      desc: 'LUMI maps actions to 62 precise enum values (src/shared/tools.ts). Every file read, command execution, or browser control has a specific handler code block rather than raw terminal access.',
      icon: <Cpu className="text-primary" size={24} />
    },
    {
      title: 'Plan Before Mutate',
      tagline: 'Look twice, write once',
      desc: 'Plan mode gathers context and strategy before writing. Only after Plan Mode outlines the implementation details does Act Mode execute file changes—with explicit approvals.',
      icon: <Sliders className="text-primary" size={24} />
    },
    {
      title: 'Provable Finish',
      tagline: 'Gated completion pipelines',
      desc: 'LUMI cannot self-proclaim a task "done." The extension runs attempts through completionGatePipeline.ts, validating ROADMAP.md milestones and checking criteria rules.',
      icon: <CheckCircle2 className="text-primary" size={24} />
    }
  ];

  const taskFlowSteps = [
    {
      title: 'User Expresses Intent',
      actor: 'Human',
      status: 'Chat Prompt',
      desc: 'You specify a task, problem, or feature addition in the extension chat sidebar, optionally attaching files, problems, or commit shas.',
      details: 'Example: "Refactor use-vibes hook to allow asynchronous calendar imports."'
    },
    {
      title: 'Controller Holds Session',
      actor: 'LUMI Host',
      status: 'BroccoliDB Synced',
      desc: 'The controller boots, loading workspace settings, active rules (.dietcoderules), and initializing a local SQLite session database.',
      details: 'BroccoliDB queries the database substrate, restoring cognitive memory context and spider maps.'
    },
    {
      title: 'Task Runs the Loop',
      actor: 'Agent Loop',
      status: 'Plan Mode Strategy',
      desc: 'Plan Mode runs read-only file tools, audits dependencies, builds a roadmap, and details exactly which modifications are required.',
      details: 'Outputs strategy via plan_mode_respond before prompting user to switch into Act Mode.'
    },
    {
      title: 'Tools Execute with Approval',
      actor: 'Act Mode / User',
      status: 'Interactive Gate',
      desc: 'LUMI requests permissions for mutating writes. You see a clear, colored side-by-side diff in the VS Code editor before anything lands on disk.',
      details: 'You can Approve or Reject individual writes, or customize instructions for the next loop iteration.'
    },
    {
      title: 'Checkpoints Preserve Rollback',
      actor: 'Shadow Git',
      status: 'Auto-Snapshots',
      desc: 'A background repository inside globalStorage/checkpoints/ records a snapshot after every single tool call, providing one-click rollbacks.',
      details: 'Not connected to your project .git/ directory, keeping your physical branch clean.'
    },
    {
      title: 'Completion Earned via Gates',
      actor: 'Validation Pipeline',
      status: 'ROADMAP.md Hardened',
      desc: 'When attempting completion, the loop runs tests, validates checklist items in the workspace, and evaluates all fail-closed gates.',
      details: 'If gate checks fail, completion blocks until rules are resolved, ensuring zero broken pushes.'
    }
  ];

  const slashCommands = [
    { name: '/newtask', purpose: 'Start a fresh task context and reset active prompt history.' },
    { name: '/compact', purpose: 'Condense conversation history to conserve token usage in long sessions.' },
    { name: '/smol', purpose: 'Toggle shorter response syntax for quick, direct answers.' },
    { name: '/newrule', purpose: 'Interactively generate a team guardrail rule file inside .dietcoderules/.' },
    { name: '/reportbug', purpose: 'Open structured diagnostics form for extension troubleshooting.' },
    { name: '/deep-planning', purpose: 'Kick off an extended multi-model planning pass for structural audits.' },
    { name: '/replan', purpose: 'Revisit project roadmap after new context or build failures.' },
    { name: '/explain-changes', purpose: 'Request the agent summarize the diffs written to the filesystem.' },
    { name: '/document', purpose: 'Generate code documentation or readme guidelines for completed changes.' },
    { name: '/roadmap', purpose: 'Directly manage ROADMAP.md kanban state and trigger audits.' }
  ];

  const mentions = [
    { name: '@/src/index.ts', type: 'File', desc: 'Brings in the full contents of a file directly to the request window.' },
    { name: '@/src/components/', type: 'Folder', desc: 'Brings in directory tree layout plus all contained source files (trailing /).' },
    { name: '@problems', type: 'System Registry', desc: 'Attaches all active diagnostics, compiler errors, and VS Code warnings.' },
    { name: '@terminal', type: 'System Registry', desc: 'Attaches recent terminal logs and standard output.' },
    { name: '@git-changes', type: 'Version Control', desc: 'Passes uncommitted local modifications to the context.' },
    { name: '@a1b2c3d', type: 'Version Control', desc: 'Brings in a git commit diff from history by specifying its hash.' },
    { name: '@https://react.dev/...', type: 'Web Content', desc: 'Instructs the browser tool to scrape a public URL and append markdown.' }
  ];

  const hooks = [
    { name: 'TaskStart', description: 'Fires when a new prompt session begins. Validates API configurations.' },
    { name: 'TaskResume', description: 'Fires when resuming an older session from local task history.' },
    { name: 'TaskCancel', description: 'Triggered when the user cancels execution. Halts active workers immediately.' },
    { name: 'TaskComplete', description: 'Fires when completion gates pass, concluding the agent session.' },
    { name: 'PreToolUse', description: 'Runs script before executing a tool. Can intercept parameters or abort.' },
    { name: 'PostToolUse', description: 'Fires immediately after a tool finishes execution, feeding logs back.' },
    { name: 'UserPromptSubmit', description: 'Intercepts user chat messages for formatting or custom tags.' },
    { name: 'PreCompact', description: 'Fires right before history compression to store key session memory states.' }
  ];

  const roadmapSettings = [
    { key: 'lumi.roadmap.enabled', default: 'true', purpose: 'Master switch to toggle roadmap steering checks.' },
    { key: 'lumi.roadmap.autoBootstrap', default: 'true', purpose: 'Create ROADMAP.md automatically from current workspace files.' },
    { key: 'lumi.roadmap.autoBootstrapFill', default: 'true', purpose: 'Automatically fill out detailed sub-items during bootstrap.' },
    { key: 'lumi.roadmap.blockKanbanOnValidationPending', default: 'true', purpose: 'Block task completion if roadmap has been modified since validation.' },
    { key: 'lumi.roadmap.failClosedCompletionGates', default: 'true', purpose: 'Fail hard and block completion if any evaluation check fails.' }
  ];

  const faqs = [
    {
      q: 'LUMI vs BroccoliDB — what is the difference?',
      a: 'BroccoliDB (@noorm/broccolidb) handles local substrate state, structural indices, and task databases. LUMI handles the user session (VS Code sidebars, chat interfaces, diff overlays, tool execution, and MCP controllers). Think of BroccoliDB as the local data layer, and LUMI as the user-facing controller/agent loop.'
    },
    {
      q: 'Why does the source code refer to "DietCode"?',
      a: 'LUMI was built on top of the open-source DietCode project skeleton. You will find files like `.dietcodeignore` and references to `DietCodeDefaultTool` inside the core engine. CardSorting is the publisher branding for this VS Code iteration.'
    },
    {
      q: 'Checkpoints are slow on a large repository, what can I do?',
      a: 'If shadow Git operations block your editor, you can disable checkpoints in settings. Keep in mind that doing this trades off the ability to run one-click rollbacks for individual tool actions.'
    },
    {
      q: 'What LLM models are supported by the active providers?',
      a: 'This build of LUMI is wired directly to 4 providers: OpenRouter, OpenAI Codex (ChatGPT Subscription), NousResearch, and Cloudflare Workers AI. You can route Plan and Act modes to separate models (e.g. reasoning models for Plan, fast code-focused models for Act).'
    },
    {
      q: 'Where do I add custom rules or hooks for my team?',
      a: 'Add rules to your project root under a `.dietcoderules/` directory. For hook scripts, create files under `.dietcoderules/hooks/` (e.g., `.dietcoderules/hooks/PreToolUse` or `.dietcoderules/hooks/TaskStart`).'
    }
  ];

  const philosophyChapters = [
    {
      title: 'I. Thesis',
      subtitle: 'Comfort is UX. Agency with approval is architecture.',
      content: (
        <div className="space-y-4 font-sans">
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            A coding companion is not finished until you can keep it open all day without feeling managed by it.
          </p>
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            LUMI (CardSorting.lumi, package.json v1.0.3) is the agent layer of the codemarie-new monorepo: a VS Code extension that plans, proposes, and executes — but never assumes consent.
          </p>
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            BroccoliDB (@noorm/broccolidb) governs repository substrate — proof, repair, durable graph truth. LUMI governs the human session — chat, diffs, terminal, browser, MCP, and the moment you click Approve.
          </p>
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            Confusing the two — letting companion warmth substitute for approval discipline — is how agents become fluent without becoming trustworthy.
          </p>
        </div>
      )
    },
    {
      title: 'II. The Chain',
      subtitle: 'Doctrine & Implementation Mappings',
      content: (
        <div className="space-y-6">
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            Every layer in the doctrine flow maps to actual code contracts inside our repository structure:
          </p>
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full font-mono text-[10px] text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-primary">
                  <th className="p-3 uppercase font-bold">Doctrine</th>
                  <th className="p-3 uppercase font-bold">Implementation in Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                <tr>
                  <td className="p-3 font-bold">User expresses intent</td>
                  <td className="p-3">Chat input, @ mentions, slash commands</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Controller holds session truth</td>
                  <td className="p-3">src/core/controller/index.ts — class Controller</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Task runs the loop</td>
                  <td className="p-3">src/core/task/index.ts — observe → stream → tool → repeat</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Tools are typed and routed</td>
                  <td className="p-3">DietCodeDefaultTool in src/shared/tools.ts → ToolExecutorCoordinator</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Host bridge executes physically</td>
                  <td className="p-3">HostProvider → src/hosts/vscode/hostbridge/</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Approval gates mutating work</td>
                  <td className="p-3">Webview diff view + autoApprove.ts + user response</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Hooks intercept lifecycle</td>
                  <td className="p-3">8 hook kinds in src/core/hooks/hook-factory.ts</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Completion is earned</td>
                  <td className="p-3">completionGatePipeline.ts + roadmap gates + audit checklist</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Memory outlives chat</td>
                  <td className="p-3">@noorm/broccolidb via cognitive memory tools + SQLite</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">Structure is provable</td>
                  <td className="p-3">Spider via src/core/policy/spider/ + dietcode_kernel tool</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      title: 'III. Comfort Without Surrender',
      subtitle: 'Respecting attention in the webview UX',
      content: (
        <div className="space-y-4">
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            Can someone keep this open all day without feeling managed by it? That is the webview north star (webview-ui/docs/LUMI_UX.md). It is not softness about safety, but respect for focus:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-white/60 font-sans text-xs">
            <li>**Tone of Voice**: Declared in `webview-ui/src/copy/lumiVoice.ts` — conversational and descriptive, never alarmist.</li>
            <li>**Visual Comfort**: Managed via `useLumiSessionComfort.ts` hooks — filters out micro-noise and excessive text updates, but never bypasses gating checks.</li>
            <li>**Transparent Audits**: Presentation styling in `auditUiStyles.ts` reads like a developer notebook, not a tribunal.</li>
          </ul>
        </div>
      )
    },
    {
      title: 'IV. Plan & Act Partitions',
      subtitle: 'Ethical posture over convenience',
      content: (
        <div className="space-y-4">
          <p className="text-white/70 font-sans leading-relaxed text-sm">
            Modes (`src/shared/storage/types.ts`: "plan" | "act") are posture partitions, not simple configuration settings:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            <div className="bg-black/40 border border-white/5 p-4">
              <span className="text-[10px] font-mono text-primary uppercase block mb-1">Plan Mode</span>
              <p className="text-white/60 text-xs font-sans">"Understand before touching" — read, search, plan, discuss. Uses strategy responses via `plan_mode_respond`.</p>
            </div>
            <div className="bg-black/40 border border-primary/20 p-4">
              <span className="text-[10px] font-mono text-primary uppercase block mb-1">Act Mode</span>
              <p className="text-white/60 text-xs font-sans">"Implement with explicit tool approval" — execute mutating file writes via `act_mode_respond` with confirmation gates.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const getProviderMetrics = (provider: 'openrouter' | 'openai' | 'nous' | 'cloudflare') => {
    switch (provider) {
      case 'openrouter':
        return { name: 'Claude 3.5 Sonnet', reasoning: 98, speed: 70, cost: 'High' };
      case 'openai':
        return { name: 'GPT-4o (Codex)', reasoning: 92, speed: 85, cost: 'Medium' };
      case 'nous':
        return { name: 'Hermes 3 (Llama)', reasoning: 85, speed: 90, cost: 'Low' };
      case 'cloudflare':
        return { name: 'Llama 3 (Workers AI)', reasoning: 75, speed: 95, cost: 'Free' };
    }
  };

  const planMetrics = getProviderMetrics(planProvider);
  const actMetrics = getProviderMetrics(actProvider);

  const filteredCommands = slashCommands.filter(cmd => 
    cmd.name.toLowerCase().includes(commandQuery.toLowerCase()) ||
    cmd.purpose.toLowerCase().includes(commandQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // SVG Wave latency generator based on provider latency speed setting
  const renderLatencyGraph = () => {
    const waveSpeed = planProvider === 'openrouter' ? 4 : planProvider === 'openai' ? 2.5 : planProvider === 'nous' ? 1.8 : 1.2;
    const waveAmp = planProvider === 'openrouter' ? 22 : planProvider === 'openai' ? 14 : planProvider === 'nous' ? 10 : 6;
    
    return (
      <div className="bg-black/60 border border-white/5 p-4 relative overflow-hidden h-24 flex flex-col justify-between rounded-none mt-4">
        <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest flex justify-between z-10">
          <span>Dynamic Provider Latency Monitor</span>
          <span className="text-primary font-bold">Hz Response</span>
        </div>
        
        {/* Animated Wave Path */}
        <svg className="w-full h-12 absolute bottom-2 left-0 right-0 opacity-45" viewBox="0 0 300 48" preserveAspectRatio="none">
          <motion.path 
            animate={{
              d: [
                `M 0 24 Q 50 ${24 - waveAmp} 100 24 T 200 24 T 300 24`,
                `M 0 24 Q 50 ${24 + waveAmp} 100 24 T 200 24 T 300 24`,
                `M 0 24 Q 50 ${24 - waveAmp} 100 24 T 200 24 T 300 24`
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: waveSpeed,
              ease: "easeInOut"
            }}
            stroke="#00FF66"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        
        <div className="flex justify-between items-center text-[9px] font-mono text-white/40 mt-auto z-10">
          <span>Latency: <strong className="text-white">{planProvider === 'openrouter' ? '480ms' : planProvider === 'openai' ? '310ms' : planProvider === 'nous' ? '180ms' : '90ms'}</strong></span>
          <span>Jitter: <strong className="text-white">&plusmn;12ms</strong></span>
        </div>
      </div>
    );
  };

  // Draw SVG branching Git checkpoints
  const renderGitGraph = () => {
    return (
      <div className="flex gap-4 items-stretch font-mono text-[10px] w-full pt-4">
        {/* Curved SVG Branch Canvas */}
        <div className="w-12 shrink-0 relative flex flex-col items-center min-h-[220px]">
          <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 48 240" fill="none" preserveAspectRatio="none">
            {/* Main Master Trunk Line */}
            <path d="M12 0 L12 240" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
            {/* Branch paths connecting master to commits */}
            {commitList.map((node, index) => {
              const y = (index * 42) + 28;
              if (node.type === 'checkpoint') {
                return (
                  <g key={node.hash}>
                    <path 
                      d={`M12 ${y - 20} C 12 ${y - 10}, 36 ${y - 10}, 36 ${y}`} 
                      stroke="#EAB308" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 2"
                    />
                    <path 
                      d={`M36 ${y} C 36 ${y + 10}, 12 ${y + 10}, 12 ${y + 20}`} 
                      stroke="#EAB308" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 2"
                    />
                  </g>
                );
              }
              if (node.type === 'write') {
                return (
                  <g key={node.hash}>
                    <path 
                      d={`M12 ${y - 20} C 12 ${y - 10}, 36 ${y - 10}, 36 ${y}`} 
                      stroke="#00FF66" 
                      strokeWidth="1.5"
                    />
                    <path 
                      d={`M36 ${y} C 36 ${y + 10}, 12 ${y + 10}, 12 ${y + 20}`} 
                      stroke="#00FF66" 
                      strokeWidth="1.5"
                    />
                  </g>
                );
              }
              return null;
            })}
          </svg>

          {/* Interactive nodes rendered overlays */}
          {commitList.map((node, index) => {
            const y = (index * 42) + 20;
            const isCheckpoint = node.type === 'checkpoint';
            const isWrite = node.type === 'write';
            
            const leftOffset = (isCheckpoint || isWrite) ? 'right-0' : 'left-2.5';
            const colorClass = isCheckpoint 
              ? 'border-yellow-400 bg-black text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.3)]' 
              : isWrite 
                ? 'border-emerald-400 bg-black text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                : 'border-white/20 bg-black text-white/50';

            return (
              <button
                key={node.hash}
                style={{ top: `${y}px` }} 
                className={`absolute w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center cursor-pointer hover:scale-125 transition-all duration-300 z-10 focus:outline-none ${leftOffset} ${colorClass}`}
                title={`Restore state from node ${node.hash}`}
                onClick={() => rollbackToCheckpoint(node)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </button>
            );
          })}
        </div>

        {/* Commit Detail List */}
        <div className="flex-1 space-y-2 relative pr-2" style={{ minHeight: `${(commitList.length * 42) + 40}px` }}>
          {commitList.map((node, index) => (
            <div 
              key={node.hash} 
              style={{ top: `${(index * 42) + 8}px` }}
              className="absolute left-0 right-0 bg-black/40 border border-white/5 p-2 flex items-center justify-between hover:border-primary/20 transition-all cursor-pointer rounded-none group"
              onClick={() => rollbackToCheckpoint(node)}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-white/20 group-hover:text-primary font-bold transition-colors">[{node.hash}]</span>
                <span className="truncate text-white/70 text-[10px]">{node.msg}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={`text-[8px] font-bold px-1 uppercase tracking-widest ${
                  node.type === 'checkpoint' ? 'text-yellow-400 bg-yellow-400/10' : node.type === 'write' ? 'text-emerald-400 bg-emerald-400/10' : 'text-white/30 bg-white/5'
                }`}>{node.type}</span>
                <span className="text-white/20 text-[8px]">{node.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Hovered architecture detail values resolver
  const getArchitectureDetail = () => {
    switch (hoveredArchNode) {
      case 'prompt':
        return {
          title: 'User Prompt Parser',
          file: 'src/components/Chat.tsx',
          desc: 'Processes user requests, resolves @mentions, and routes queries into active task states.',
          snippet: `const processPrompt = async (text: string) => {\n  const mentions = parseMentions(text);\n  const task = await TaskStore.create(text, mentions);\n  return task;\n};`
        };
      case 'controller':
        return {
          title: 'Lumi Controller Session',
          file: 'src/core/controller/index.ts',
          desc: 'Keeps track of workspace status, rules databases, active task logs, and user consent gates.',
          snippet: `class Controller {\n  async runTaskLoop(task: Task) {\n    const plan = await this.plan(task);\n    const approval = await this.askApproval(plan);\n    if (approval.accepted) return this.execute(plan);\n  }\n}`
        };
      case 'router':
        return {
          title: 'LLM Model Router',
          file: 'src/core/router.ts',
          desc: 'Binds provider configuration credentials to direct LLM endpoints, splitting reasoning and execution workloads.',
          snippet: `export const getRouterModel = (mode: 'plan' | 'act') => {\n  const config = loadProviders();\n  return config[mode].provider;\n};`
        };
      case 'host':
        return {
          title: 'VS Code Host Bridge',
          file: 'src/hosts/vscode/hostbridge/',
          desc: 'Implements physical workspace tasks like executing terminal scripts or modifying file channels over gRPC.',
          snippet: `export class VsCodeHostProvider implements HostProvider {\n  async applyFileEdit(path: string, diff: string) {\n    return gRpcBridge.call("applyEdit", { path, diff });\n  }\n}`
        };
      case 'workspace':
        return {
          title: 'Physical Workspace Files',
          file: 'project root',
          desc: 'Contains repository file contents, diagnostics, and linter check engines.',
          snippet: `// completionGatePipeline.ts\nexport async function runChecks() {\n  const linter = exec("npm run lint");\n  if (linter.code !== 0) throw new Error("Gates failed");\n}`
        };
      default:
        return {
          title: 'Technical Framework Architecture',
          file: 'codemarie monorepo',
          desc: 'Hover over individual elements above to inspect data pathways, relative files mapping, and active code snippets.',
          snippet: `// Select a node to view code bindings`
        };
    }
  };

  const activeArchDetails = getArchitectureDetail();

  // Render SVG Flowchart Architecture
  const renderArchitectureFlow = () => {
    return (
      <div className="space-y-6">
        <div className="border border-white/10 bg-[#0C0C0D] p-6 relative rounded-none">
          <div className="absolute top-4 right-4 text-[8px] font-mono text-white/20 uppercase tracking-widest">
            Active gRPC/Protobuf Routing Lines
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10 pt-4">
            {[
              { id: 'prompt', label: '1. User Prompt', file: 'src/components/Chat.tsx' },
              { id: 'controller', label: '2. Controller', file: 'src/core/controller/' },
              { id: 'router', label: '3. Model Router', file: 'src/core/router.ts' },
              { id: 'host', label: '4. Host Bridge', file: 'src/hosts/vscode/' },
              { id: 'workspace', label: '5. Workspace', file: 'workspace root' }
            ].map((node, index) => (
              <div 
                key={node.id}
                onMouseEnter={() => setHoveredArchNode(node.id)}
                className={`bg-black/70 border p-4 relative group cursor-pointer transition-all flex flex-col justify-between min-h-[90px] ${
                  hoveredArchNode === node.id ? 'border-primary shadow-[0_0_8px_rgba(0,255,102,0.15)] bg-primary/[0.02]' : 'border-white/5'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono uppercase block mb-1 font-bold ${
                    hoveredArchNode === node.id ? 'text-primary' : 'text-white/60'
                  }`}>{node.label}</span>
                  <span className="text-[8px] font-mono text-white/30 block truncate mt-2">{node.file}</span>
                </div>
                {index < 4 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2.5 -translate-y-1/2 z-25 text-primary font-mono select-none">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-black/40 border border-dashed border-white/10 p-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <div>
                <div className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Substrate Layer: BroccoliDB Connection</div>
                <p className="text-white/45 text-[10px] font-sans">The Controller streams session steps to a SQLite substrate database, preserving checkpoints.</p>
              </div>
            </div>
            <div className="font-mono text-[9px] text-white/35">
              Sync Speed: <span className="text-primary font-bold">0.4ms</span> &bull; Checkpoint Overhead: <span className="text-primary font-bold">12ms</span>
            </div>
          </div>
        </div>

        {/* Hover inspector values board */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 animate-fade-in">
          <div className="md:col-span-5 bg-white/2 border border-white/5 p-5 flex flex-col justify-between font-mono text-[10px]">
            <div className="space-y-3">
              <span className="text-primary font-bold uppercase tracking-widest border-b border-primary/25 pb-1 block">
                {activeArchDetails.title}
              </span>
              <p className="text-white/60 font-sans text-xs leading-relaxed font-light">
                {activeArchDetails.desc}
              </p>
            </div>
            <div className="text-white/30 text-[8px] mt-6 flex justify-between">
              <span>BOUNDS: {activeArchDetails.file}</span>
              <span className="text-primary font-bold">ACTIVE_READ</span>
            </div>
          </div>

          <div className="md:col-span-7 bg-[#050506] border border-white/10 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[8px] font-mono text-white/30 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">
              <span>Binding Interface Segment</span>
              <span>Syntax: TypeScript</span>
            </div>
            <pre className="text-emerald-400 font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre pr-2 max-h-[140px] custom-scrollbar">
              <code>{activeArchDetails.snippet}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  };

  // Render True Split Diff Editor Pane
  const renderSplitDiff = () => {
    const originalLines = filesContent['server.ts'].original.split('\n');
    const proposedLines = filesContent['server.ts'].proposed.split('\n');

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px] leading-tight flex-1">
        {/* Original Editor Pane */}
        <div className="border border-white/5 bg-black/20 overflow-x-auto rounded-none flex flex-col min-h-[220px]">
          <div className="bg-black/50 px-3 py-1.5 text-[9px] text-white/40 uppercase font-mono tracking-widest border-b border-white/5 flex items-center justify-between">
            <span>src/server.ts (Original)</span>
            <span className="text-red-500 font-bold">- Deletions</span>
          </div>
          <div className="p-3 flex-1 font-mono leading-relaxed">
            {originalLines.map((line, idx) => (
              <div key={idx} className="flex hover:bg-white/2 transition-colors">
                <span className="w-8 text-white/20 select-none text-right pr-2 border-r border-white/5 mr-2 shrink-0">{idx + 1}</span>
                <span className="whitespace-pre">{highlightCodeLine(line, 'ts')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Proposed Editor Pane */}
        <div className="border border-primary/20 bg-primary/[0.01] overflow-x-auto rounded-none flex flex-col min-h-[220px]">
          <div className="bg-black/50 px-3 py-1.5 text-[9px] text-primary uppercase font-mono tracking-widest border-b border-white/5 flex items-center justify-between">
            <span>src/server.ts (Proposed Edit)</span>
            <span className="text-emerald-400 font-bold">+ Insertions</span>
          </div>
          <div className="p-3 flex-1 font-mono leading-relaxed">
            {proposedLines.map((line, idx) => {
              const isAddedLine = idx >= 8 && idx <= 12; // Health endpoint insertion
              return (
                <div 
                  key={idx} 
                  className={`flex hover:bg-white/2 transition-colors ${
                    isAddedLine ? 'bg-emerald-950/40 border-l-2 border-emerald-400' : ''
                  }`}
                >
                  <span className="w-8 text-white/20 select-none text-right pr-2 border-r border-white/5 mr-2 shrink-0">{idx + 1}</span>
                  <span className={`${isAddedLine ? 'text-emerald-300 font-semibold' : ''} whitespace-pre`}>
                    {highlightCodeLine(line, 'ts')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F0F0F0] pt-12 pb-24 font-sans selection:bg-primary selection:text-black">
      <SEO 
        title="LUMI | Calm Coding Companion" 
        description="A comfort-first agentic pair programmer inside VS Code. Human-in-the-loop by default, typed tools, shadow Git checkpoints, and BroccoliDB memory integration."
        keywords={["lumi", "coding agent", "VS Code extension", "pair programming", "BroccoliDB", "human-in-the-loop"]}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'LUMI', item: '/lumi' }
        ]}
      />

      {/* Decorative Grid and Glow Backgrounds */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[15%] left-[10%] w-[35%] h-[35%] bg-primary/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[40%] h-[40%] bg-primary/5 blur-[180px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Section 1: Hero */}
        <section className="pt-20 pb-16 border-b border-white/5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-primary/20 pointer-events-none hidden md:block"></div>
          <div className="absolute top-4 right-4 text-[9px] font-mono text-primary/40 hidden md:block uppercase tracking-widest">
            REGISTRY // SLC_AI_TOWNHALL // AGENT
          </div>

          <div className="space-y-8 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-primary">
                Active Coding Companion // v1.0.5
              </span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-black text-6xl md:text-9xl leading-[0.85] tracking-tighter"
              >
                <GlitchText text="LUMI." className="text-white hover:text-primary transition-colors" />
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/60 text-xl md:text-3xl font-light leading-snug tracking-tight max-w-3xl font-sans"
              >
                A calm coding companion — comfort-first agentic pair programming inside VS Code.
              </motion.p>
            </div>

            {/* Quick Badge Grid */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4 font-mono text-[9px] uppercase tracking-widest text-white/50"
            >
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">Publisher</span>
                <span className="font-bold text-white">CardSorting</span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">License</span>
                <span className="font-bold text-white">Apache-2.0</span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">VS Marketplace</span>
                <span className="font-bold text-primary hover:underline"><a href="https://marketplace.visualstudio.com/items?itemName=CardSorting.lumi-vscode" target="_blank" rel="noopener noreferrer">Active</a></span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">Open VSX ID</span>
                <span className="font-bold text-primary hover:underline"><a href="https://open-vsx.org/extension/CardSorting/lumi" target="_blank" rel="noopener noreferrer">CardSorting.lumi</a></span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">Substrate</span>
                <span className="font-bold text-white">BroccoliDB</span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">Security</span>
                <span className="font-bold text-green-400">100% Gated</span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">Monorepo</span>
                <span className="font-bold text-white">Root + DB</span>
              </div>
              <div className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between">
                <span className="text-white/30 mb-2">Homepage</span>
                <span className="font-bold text-white hover:text-primary"><a href="https://dietcode.io" target="_blank" rel="noopener noreferrer">dietcode.io</a></span>
              </div>
            </motion.div>

            {/* Install terminal commands switcher */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-6"
            >
              <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">CLI Installation Matrix</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {installMethods.map((method) => (
                  <div key={method.id} className="bg-[#0C0C0D] border border-white/10 p-5 relative group flex flex-col justify-between hover:border-primary/20 transition-all">
                    <div>
                      <div className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">
                        {method.url ? (
                          <a href={method.url} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                            {method.title} <ExternalLink size={10} />
                          </a>
                        ) : (
                          method.title
                        )}
                      </div>
                      <p className="text-[11px] text-white/50 font-sans leading-tight mb-4">{method.description}</p>
                    </div>
                    <div className="flex items-center justify-between bg-black/50 border border-white/5 p-2 font-mono text-[10px]">
                      <code className="text-white/70 overflow-x-auto whitespace-nowrap scrollbar-none mr-2">{method.command}</code>
                      <button 
                        onClick={() => handleCopy(method.command)}
                        className="text-white/40 hover:text-primary shrink-0 transition-colors p-1"
                        aria-label="Copy command"
                      >
                        {copiedCommand === method.command ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Interactive VS Code Simulation Sandbox (World-class UX) */}
        <section className="py-20 border-b border-white/5 relative">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">SANDBOX // WORKSPACE_SIMULATION</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
            <div>
              <h2 className="text-4xl font-display font-black tracking-tighter uppercase">INTERACTIVE DOCTRINE SIMULATOR</h2>
              <p className="text-white/60 text-lg font-light max-w-3xl leading-relaxed font-sans">
                Experience the "human-in-the-loop by design" task loop in this live interactive VS Code environment model.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-white/10 font-mono text-[9px] text-white/40 bg-white/2 rounded-none">
              <Keyboard size={12} className="text-primary animate-pulse" />
              <span>HOTKEYS: [I] Init &bull; [P] Plan &bull; [A] Approve &bull; [R] Reset &bull; [Y] YOLO Toggle</span>
            </div>
          </div>

          <div className="bg-[#09090A] border border-white/10 rounded-none shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* Simulation Left Pane: VS Code Editor Pane (8 cols) */}
            <div className="lg:col-span-8 border-r border-white/10 flex flex-col justify-between bg-[#0C0C0D] relative">
              {/* File tabs bar */}
              <div className="h-10 bg-black/40 border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-[10px] font-mono text-white/30 ml-4">WORKSPACE // codemarie-new</span>
                </div>
                
                {/* Visual Editor Tabs */}
                <div className="flex gap-1 h-10 items-end">
                  <button 
                    onClick={() => setActiveFile('server.ts')}
                    className={`flex items-center gap-2 px-3 py-1 text-[10px] font-mono h-8 border-t-2 transition-colors duration-150 ${
                      activeFile === 'server.ts' 
                        ? 'bg-[#0C0C0D] border-primary text-white font-bold' 
                        : 'bg-black/20 border-transparent text-white/40 hover:text-white/80'
                    }`}
                  >
                    <Code2 size={11} className={activeFile === 'server.ts' ? 'text-primary' : 'text-white/30'} />
                    src/server.ts
                    {simStep === 3 && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />}
                  </button>
                  <button 
                    onClick={() => setActiveFile('package.json')}
                    className={`flex items-center gap-2 px-3 py-1 text-[10px] font-mono h-8 border-t-2 transition-colors duration-150 ${
                      activeFile === 'package.json' 
                        ? 'bg-[#0C0C0D] border-primary text-white font-bold' 
                        : 'bg-black/20 border-transparent text-white/40 hover:text-white/80'
                    }`}
                  >
                    <FileText size={11} className={activeFile === 'package.json' ? 'text-primary' : 'text-white/30'} />
                    package.json
                  </button>
                  <button 
                    onClick={() => setActiveFile('dietcoderules')}
                    className={`flex items-center gap-2 px-3 py-1 text-[10px] font-mono h-8 border-t-2 transition-colors duration-150 ${
                      activeFile === 'dietcoderules' 
                        ? 'bg-[#0C0C0D] border-primary text-white font-bold' 
                        : 'bg-black/20 border-transparent text-white/40 hover:text-white/80'
                    }`}
                  >
                    <Settings size={11} className={activeFile === 'dietcoderules' ? 'text-primary' : 'text-white/30'} />
                    .dietcoderules
                  </button>
                </div>
              </div>

              {/* Main Workspace Layout with Explorer sidebar (if toggled) */}
              <div className="flex flex-1 overflow-hidden">
                {/* Collapsible File Explorer Sidebar */}
                {explorerOpen && (
                  <div className="w-48 bg-black/20 border-r border-white/5 flex flex-col p-3 font-mono text-[10px] select-none text-white/60 shrink-0">
                    <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mb-3 flex justify-between items-center">
                      <span>File Explorer</span>
                      <button onClick={() => setExplorerOpen(false)} className="text-white/20 hover:text-white cursor-pointer">&larr;</button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <FolderOpen size={12} />
                        <span>codemarie-new</span>
                      </div>
                      
                      <div className="pl-3 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-white/40">
                          <FolderOpen size={12} />
                          <span>src</span>
                        </div>
                        
                        <div className="pl-3 space-y-1">
                          <button 
                            onClick={() => setActiveFile('server.ts')} 
                            className={`flex items-center gap-1.5 w-full text-left truncate py-0.5 cursor-pointer ${
                              activeFile === 'server.ts' ? 'text-primary font-bold' : 'text-white/70 hover:text-white'
                            }`}
                          >
                            <File size={10} />
                            <span>server.ts</span>
                            {simStep === 3 && <div className="w-1 h-1 rounded-full bg-yellow-400 shrink-0" />}
                          </button>
                          
                          <div className="flex items-center gap-1.5 text-white/30 py-0.5">
                            <File size={10} />
                            <span>index.ts</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveFile('dietcoderules')}
                          className={`flex items-center gap-1.5 w-full text-left truncate py-0.5 cursor-pointer ${
                            activeFile === 'dietcoderules' ? 'text-primary font-bold' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          <Folder size={12} className="text-white/40" />
                          <span>.dietcoderules</span>
                        </button>

                        <button 
                          onClick={() => setActiveFile('package.json')}
                          className={`flex items-center gap-1.5 w-full text-left truncate py-0.5 cursor-pointer ${
                            activeFile === 'package.json' ? 'text-primary font-bold' : 'text-white/70 hover:text-white'
                          }`}
                        >
                          <File size={10} />
                          <span>package.json</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show explorer expand toggle if closed */}
                {!explorerOpen && (
                  <button 
                    onClick={() => setExplorerOpen(true)} 
                    className="w-5 bg-black/40 hover:bg-black/60 border-r border-white/5 text-white/40 hover:text-white flex items-center justify-center font-mono text-[9px] cursor-pointer"
                  >
                    &rarr;
                  </button>
                )}

                {/* Code viewport area */}
                <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#0A0A0B]/60 p-4">
                  <div className="flex-1 overflow-auto flex">
                    {simStep === 0 && (
                      <div className="h-full w-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                        <Terminal className="text-white/10 animate-pulse" size={64} strokeWidth={1} />
                        <div className="space-y-1">
                          <p className="text-xs uppercase tracking-widest text-primary font-bold">// LUMI PIPELINE SANDBOX READY</p>
                          <p className="text-[11px] text-white/40 max-w-sm font-sans">Press "Initialize Task" (or key [I]) in the side console to trigger the interactive task simulation.</p>
                        </div>
                      </div>
                    )}

                    {simStep === 1 && (
                      <div className="font-mono text-[11px] text-white/70 w-full animate-fade-in flex">
                        <div className="text-white/20 select-none text-right pr-3 border-r border-white/5 mr-3 w-8 shrink-0">
                          {getActiveCode().split('\n').map((_, i) => <div key={i}>{i+1}</div>)}
                        </div>
                        <pre className="text-white/80 font-mono leading-relaxed overflow-x-auto flex-1 select-text">
                          <code>
                            {getActiveCode().split('\n').map((line, idx) => (
                              <div key={idx}>{highlightCodeLine(line, getActiveFileType())}</div>
                            ))}
                          </code>
                        </pre>
                      </div>
                    )}

                    {simStep === 2 && (
                      <div className="w-full h-full flex flex-col justify-between relative">
                        <div className="absolute inset-0 bg-primary/[0.01] border border-primary/10 rounded-none p-4 flex flex-col items-center justify-center backdrop-blur-[1px] text-center z-10">
                          <RefreshCw size={28} className="text-primary animate-spin mb-3" />
                          <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Plan Mode: Gaining Context...</span>
                          <span className="text-[9px] text-white/40 mt-1 font-sans">LUMI is reading directory tree and analyzing imports</span>
                        </div>
                        <div className="font-mono text-[11px] text-white/10 select-none flex w-full">
                          <div className="text-white/5 select-none text-right pr-3 border-r border-white/5 mr-3 w-8 shrink-0">
                            {getActiveCode().split('\n').map((_, i) => <div key={i}>{i+1}</div>)}
                          </div>
                          <pre className="font-mono leading-relaxed flex-1">
                            <code>
                              {getActiveCode().split('\n').map((line, idx) => (
                                <div key={idx}>{highlightCodeLine(line, getActiveFileType())}</div>
                              ))}
                            </code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {simStep === 3 && activeFile === 'server.ts' && (
                      <div className="w-full flex flex-col">
                        <div className="flex justify-between items-center text-[9px] font-bold text-yellow-400 bg-yellow-400/5 border border-yellow-400/20 px-3 py-1.5 uppercase tracking-widest mb-3">
                          <span className="flex items-center gap-1.5"><AlertTriangle size={12} /> PROPOSED CHANGES: review required</span>
                          <span>+3 LINES</span>
                        </div>
                        {renderSplitDiff()}
                      </div>
                    )}

                    {simStep === 3 && activeFile !== 'server.ts' && (
                      <div className="font-mono text-[11px] text-white/70 w-full flex">
                        <div className="text-white/20 select-none text-right pr-3 border-r border-white/5 mr-3 w-8 shrink-0">
                          {getActiveCode().split('\n').map((_, i) => <div key={i}>{i+1}</div>)}
                        </div>
                        <pre className="text-white/80 font-mono leading-relaxed overflow-x-auto flex-1 select-text">
                          <code>
                            {getActiveCode().split('\n').map((line, idx) => (
                              <div key={idx}>{highlightCodeLine(line, getActiveFileType())}</div>
                            ))}
                          </code>
                        </pre>
                      </div>
                    )}

                    {simStep === 4 && (
                      <div className="space-y-4 animate-fade-in w-full font-mono text-[11px]">
                        <span className="text-white/30 font-mono block">// 4. Executing Gated Validations</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-black/50 border border-white/5 p-3 flex flex-col justify-between">
                            <span className="text-white/40 font-sans">1. Shadow Snapshot</span>
                            <span className="text-primary font-bold flex items-center gap-1"><Check size={12} /> SAVED</span>
                          </div>
                          <div className="bg-black/50 border border-white/5 p-3 flex flex-col justify-between">
                            <span className="text-white/40 font-sans">2. Code Linter Check</span>
                            <span className="text-primary font-bold flex items-center gap-1"><Check size={12} /> LINT_OK</span>
                          </div>
                          <div className="bg-black/50 border border-white/5 p-3 flex flex-col justify-between">
                            <span className="text-white/40 font-sans">3. ROADMAP Gate</span>
                            <span className="text-primary font-bold flex items-center gap-1"><Check size={12} /> PASSED</span>
                          </div>
                        </div>
                        <div className="bg-[#050506] border border-white/10 p-3 rounded-none text-white/50 space-y-1">
                          <div className="text-primary font-bold">&gt; tsc --noEmit</div>
                          <div>react-example@0.0.0 lint</div>
                          <div className="text-green-400 font-bold">// Done in 0.4s. 0 errors found.</div>
                        </div>
                      </div>
                    )}

                    {simStep === 5 && (
                      <div className="space-y-4 flex flex-col items-center justify-center text-center py-6 animate-fade-in w-full">
                        <CheckCircle2 size={48} className="text-primary animate-bounce" />
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-white">TASK SUCCESSFULLY REGISTERED</h4>
                          <p className="text-xs text-white/50 max-w-sm font-sans leading-relaxed">
                            The modifications were successfully written to disk after your explicit authorization. Shadow Git committed a checkpoint and validation gates reported clean.
                          </p>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-3 font-mono text-[9px] text-white/40 max-w-md w-full">
                          ROADMAP.md // [x] Milestone: Append server /health endpoint &mdash; OK
                        </div>
                      </div>
                    )}
                  </div>

                  {/* VS Code Code Minimap Simulation */}
                  {simStep > 0 && (
                    <div className="absolute right-2 top-14 bottom-14 w-12 bg-black/45 border-l border-white/5 p-1 select-none pointer-events-none hidden md:flex flex-col">
                      <div className="text-[5px] font-mono leading-[2px] opacity-15 overflow-hidden flex-1 select-none whitespace-pre font-light">
                        {getActiveCode()}
                      </div>
                      {simStep === 3 && (
                        <div className="absolute right-0 top-1/2 w-full h-4 bg-yellow-400/20 border-y border-yellow-400/30" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* High-fidelity Bottom Terminal / Problems Tabs Panel */}
              {simStep > 0 && (
                <div className="h-44 bg-black/60 border-t border-white/10 flex flex-col font-mono text-[10px] overflow-hidden">
                  <div className="h-8 bg-black/40 border-b border-white/5 flex items-center justify-between px-4">
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setSimTerminalTab('terminal')}
                        className={`font-bold uppercase tracking-widest pb-1 border-b cursor-pointer ${
                          simTerminalTab === 'terminal' ? 'text-primary border-primary' : 'text-white/40 border-transparent hover:text-white'
                        }`}
                      >
                        Terminal
                      </button>
                      <button 
                        onClick={() => setSimTerminalTab('problems')}
                        className={`font-bold uppercase tracking-widest pb-1 border-b flex items-center gap-1.5 cursor-pointer ${
                          simTerminalTab === 'problems' ? 'text-primary border-primary' : 'text-white/40 border-transparent hover:text-white'
                        }`}
                      >
                        Problems <span className="px-1 bg-white/10 rounded-full text-[8px] text-white/60">0</span>
                      </button>
                      <button 
                        onClick={() => setSimTerminalTab('logs')}
                        className={`font-bold uppercase tracking-widest pb-1 border-b cursor-pointer ${
                          simTerminalTab === 'logs' ? 'text-primary border-primary' : 'text-white/40 border-transparent hover:text-white'
                        }`}
                      >
                        LUMI agent logs
                      </button>
                    </div>
                    <div className="text-white/30 text-[9px] uppercase tracking-wider">
                      Shell Status // Connected
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-black/20 font-mono text-[11px] leading-relaxed">
                    {simTerminalTab === 'terminal' && (
                      <div className="space-y-1.5 font-mono">
                        {simTerminalOutput.map((log, idx) => (
                          <div key={idx} className="whitespace-pre-wrap">{log}</div>
                        ))}
                        <div ref={terminalEndRef} />
                        <form onSubmit={handleTerminalCommandSubmit} className="flex items-center gap-1 mt-1">
                          <span className="text-primary font-bold">$</span>
                          <input 
                            type="text" 
                            value={simTerminalInput}
                            onChange={(e) => setSimTerminalInput(e.target.value)}
                            placeholder="Type commands (e.g. lumi status, npm run dev, clear)..."
                            className="bg-transparent border-none focus:ring-0 focus:outline-none text-white w-full p-0 font-mono text-[11px]"
                          />
                        </form>
                      </div>
                    )}

                    {simTerminalTab === 'problems' && (
                      <div className="flex flex-col items-center justify-center h-full text-white/30 italic text-[10px]">
                        No diagnostics warnings detected in workspace files.
                      </div>
                    )}

                    {simTerminalTab === 'logs' && (
                      <div className="space-y-1 text-white/50 text-[10px] font-mono">
                        <div>[LUMI] Initialized session token stream.</div>
                        <div>[LUMI] Running with rules profile from .dietcoderules/custom-rule.md</div>
                        {simLog.map((log, idx) => (
                          <div key={idx}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Progress bar / bottom log */}
              <div className="h-10 bg-black/60 border-t border-white/5 flex items-center justify-between px-6 font-mono text-[9px] z-10">
                <div className="flex items-center gap-2">
                  <Activity size={10} className="text-primary animate-pulse" />
                  <span className="text-white/40 uppercase tracking-widest">SUBSTRATE_STATUS // {simStep === 5 ? 'COMPLETED' : 'STABLE'}</span>
                </div>
                {simStep > 1 && simStep < 5 && (
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 uppercase">ANALYSIS_PROGRESS: {simProgress}%</span>
                    <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${simProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Simulation Right Pane: LUMI Agent Sidebar console (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-black/30 animate-fade-in relative">
              
              {/* YOLO Alert Banner */}
              {yoloMode && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-6 py-2 flex items-center justify-between text-[9px] font-mono text-yellow-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Zap size={10} className="animate-bounce" /> YOLO Active</span>
                  <span>Bypassing Gated Approvals</span>
                </div>
              )}

              <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div>
                  <div className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] font-bold mb-1">Agent Console Viewport</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex justify-between items-center">
                    <span>LUMI_SIDEBAR_CHAT</span>
                    <button 
                      onClick={() => {
                        setYoloMode(!yoloMode);
                        toast.info(yoloMode ? 'YOLO Mode Deactivated' : 'YOLO Mode Activated');
                      }}
                      className={`text-[8px] font-mono px-2 py-0.5 border tracking-widest uppercase transition-all cursor-pointer ${
                        yoloMode ? 'bg-yellow-400 text-black border-yellow-400 font-bold' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      YOLO Mode: {yoloMode ? 'ON' : 'OFF'}
                    </button>
                  </h3>
                </div>

                <Separator className="bg-white/5" />

                {/* Simulated Conversation scrolls */}
                <div className="space-y-4 max-h-[260px] overflow-y-auto text-[11px] leading-relaxed custom-scrollbar pr-2 font-sans flex-1 flex flex-col justify-between">
                  <div>
                    {simStep === 0 && (
                      <div className="text-white/40 italic py-8 text-center font-sans">
                        Console waiting to begin a task...
                      </div>
                    )}

                    {simStep >= 1 && (
                      <div className="space-y-3">
                        <div className="bg-white/2 border border-white/5 p-3">
                          <div className="text-[9px] font-mono text-white/30 uppercase mb-1">Human // Intent</div>
                          <p className="text-white/70">Create a health check endpoint at \'/health\' returning 200 OK and server timestamps.</p>
                        </div>
                      </div>
                    )}

                    {simStep >= 2 && (
                      <div className="space-y-3 mt-3 animate-fade-in">
                        <div className="bg-primary/5 border border-primary/20 p-3">
                          <div className="text-[9px] font-mono text-primary uppercase mb-1">LUMI // Plan Mode</div>
                          <p className="text-white/70">Analyzing file dependencies. I will add the router block inside \'src/server.ts\' before the listen invocation.</p>
                        </div>
                      </div>
                    )}

                    {simStep >= 3 && (
                      <div className="space-y-3 mt-3 animate-fade-in">
                        <div className="bg-primary/5 border border-primary/20 p-3">
                          <div className="text-[9px] font-mono text-primary uppercase mb-1">LUMI // Act Mode</div>
                          <p className="text-white/70">Proposed changes staged in the workspace. Please review the file diff and approve the mutating write operation.</p>
                        </div>
                      </div>
                    )}

                    {simStep >= 4 && (
                      <div className="space-y-3 mt-3 animate-fade-in">
                        <div className="bg-[#0C0C0D] border border-white/5 p-3 font-mono text-[9px] text-white/50 space-y-1">
                          {simLog.map((log, idx) => (
                            <div key={idx}>{log}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons footer inside agent sidebar */}
              <div className="p-6 border-t border-white/5 bg-black/20 space-y-3">
                {simStep === 0 && (
                  <Button 
                    onClick={() => setSimStep(1)} 
                    className="w-full bg-primary text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-white flex justify-between px-4 cursor-pointer"
                  >
                    <span>Initialize Task</span>
                    <span className="bg-black/35 text-white/60 border border-white/10 px-1 py-0.5 rounded text-[8px]">Hotkey [I]</span>
                  </Button>
                )}

                {simStep === 1 && (
                  <Button 
                    onClick={() => setSimStep(2)} 
                    className="w-full bg-primary text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-white flex justify-between px-4 cursor-pointer"
                  >
                    <span>Start Plan Mode</span>
                    <span className="bg-black/35 text-white/60 border border-white/10 px-1 py-0.5 rounded text-[8px]">Hotkey [P]</span>
                  </Button>
                )}

                {simStep === 2 && (
                  <Button 
                    onClick={() => handleTransitionToActMode()} 
                    disabled={simProgress < 100}
                    className="w-full bg-primary text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-white disabled:opacity-40 flex justify-between px-4 cursor-pointer"
                  >
                    <span>Transition to Act Mode</span>
                    <span className="bg-black/35 text-white/60 border border-white/10 px-1 py-0.5 rounded text-[8px]">Hotkey [A]</span>
                  </Button>
                )}

                {simStep === 3 && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={approveMutatingWrite} 
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-none flex flex-col justify-center items-center gap-0.5 cursor-pointer"
                    >
                      <span>Approve Diff</span>
                      <span className="text-[7px] opacity-70 tracking-normal font-mono font-normal bg-black/20 px-1 rounded text-white">[Hotkey A]</span>
                    </Button>
                    <Button 
                      onClick={rejectMutatingWrite} 
                      variant="destructive"
                      className="flex-1 font-black uppercase tracking-widest text-[10px] h-12 rounded-none flex flex-col justify-center items-center gap-0.5 cursor-pointer"
                    >
                      <span>Reject</span>
                      <span className="text-[7px] opacity-70 tracking-normal font-mono font-normal bg-black/20 px-1 rounded text-white">[Hotkey R]</span>
                    </Button>
                  </div>
                )}

                {simStep === 4 && (
                  <div className="h-12 flex items-center justify-center font-mono text-[10px] text-primary/70 animate-pulse">
                    Running Gated Pipelines...
                  </div>
                )}

                {simStep === 5 && (
                  <Button 
                    onClick={resetSimulator} 
                    variant="outline"
                    className="w-full border-white/10 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-white/5 flex justify-between px-4 cursor-pointer"
                  >
                    <span>Reset Simulator</span>
                    <span className="bg-black/35 text-white/60 border border-white/10 px-1 py-0.5 rounded text-[8px]">Hotkey [R]</span>
                  </Button>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: Philosophy of Calm Agency Section */}
        <section className="py-20 border-b border-white/5" id="philosophy">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">PHILOSOPHY // CALM_AGENCY</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-4">A PHILOSOPHY OF CALM AGENCY</h2>
          <p className="text-white/60 text-lg font-light max-w-3xl leading-relaxed mb-12 font-sans">
            LUMI is defined by design values grounded in actual code implementation. We design boundaries so coding companions remain respectful partners.
          </p>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar chapters selectors */}
            <div className="lg:col-span-4 space-y-2">
              {philosophyChapters.map((chapter, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhilosophyTab(idx)}
                  className={`w-full text-left p-4 border transition-all relative flex flex-col rounded-none cursor-pointer ${
                    activePhilosophyTab === idx 
                      ? 'bg-primary/5 border-primary text-white' 
                      : 'bg-white/2 border-white/5 text-white/40 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-[9px] font-mono text-primary/80 mb-1">{chapter.title.split('. ')[0]}</span>
                  <span className="text-xs font-bold uppercase tracking-wider leading-none">
                    {chapter.title.substring(chapter.title.indexOf(' ') + 1)}
                  </span>
                </button>
              ))}
            </div>

            {/* Read viewport */}
            <div className="lg:col-span-8 bg-[#0C0C0D] border border-white/10 p-8 flex flex-col justify-between min-h-[420px] rounded-none">
              <div className="space-y-6">
                <div>
                  <div className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] font-bold">
                    Chapter {activePhilosophyTab + 1} // Substack
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white mt-1">
                    {philosophyChapters[activePhilosophyTab].title}
                  </h3>
                  <p className="text-[11px] font-serif italic text-white/40 mt-1">
                    {philosophyChapters[activePhilosophyTab].subtitle}
                  </p>
                </div>

                <Separator className="bg-white/5" />

                <div className="text-sm font-sans font-light leading-relaxed text-white/70 space-y-4 animate-fade-in">
                  {philosophyChapters[activePhilosophyTab].content}
                </div>
              </div>

              <div className="pt-8 border-t border-t-white/5 mt-8 flex items-center justify-between text-[10px] font-mono text-white/30">
                <span className="flex items-center gap-1.5"><BookOpen size={12} className="text-primary" /> Reference: docs/papers/philosophy.md</span>
                <span>Page {activePhilosophyTab + 1} of 4</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: The 4 Pillars of Calm Agency */}
        <section className="py-20 border-b border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">DESIGN_PHILOSOPHY // DESIGN_PILLARS</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-4">THE FOUR PILLARS</h2>
          <p className="text-white/60 text-lg font-light max-w-3xl leading-relaxed mb-16">
            LUMI is architected around calm execution, keeping the human developers in control. Every pillar is mapped directly to actual codebase safety gates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, idx) => (
              <div 
                key={idx} 
                className="bg-[#0C0C0D] border border-white/10 hover:border-primary/40 transition-all p-8 relative flex flex-col justify-between group rounded-none"
              >
                <div className="absolute top-6 right-6 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  {pillar.icon}
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] font-bold">{pillar.tagline}</span>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{pillar.title}</h3>
                  </div>
                  <p className="text-white/50 font-sans font-light leading-relaxed text-sm">{pillar.desc}</p>
                </div>
                
                {/* Visual Branching Git Graph for BroccoliDB substrate layer */}
                {pillar.title === 'Plan Before Mutate' && (
                  <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-white/30 uppercase">// BroccoliDB Shadow Git Commits</span>
                      <button 
                        onClick={triggerBroccoliSnapshot}
                        className="px-2.5 py-1 bg-primary/10 border border-primary/20 hover:bg-primary hover:text-black font-mono text-[8px] uppercase tracking-widest text-primary transition-all flex items-center gap-1 rounded-none cursor-pointer"
                      >
                        <RefreshCw size={8} className="animate-spin-slow" /> Audit Snapshot
                      </button>
                    </div>
                    {renderGitGraph()}
                  </div>
                )}

                <div className="h-px bg-white/5 w-full mt-6"></div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/2 border border-white/5 p-6 flex flex-col md:flex-row gap-8 items-center justify-between rounded-none">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-primary font-bold">
                <Info size={14} /> SYSTEM REFERENCE: docs/AGENT_STACK.md
              </div>
              <p className="text-white/50 text-xs font-sans max-w-3xl font-light">
                Do not confuse substrate realities with user session controls. **BroccoliDB** handles substrate realities (SQL database context, Spider audits, checkpoints). **LUMI** orchestrates the active user interface (chat layouts, prompt rendering, provider routing, and approval blocks).
              </p>
            </div>
            <a 
              href="https://dietcode.io" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] font-mono text-white/50 hover:text-primary transition-colors flex items-center gap-1.5 shrink-0 uppercase tracking-widest font-black"
            >
              Explore Stack <ExternalLink size={12} />
            </a>
          </div>
        </section>

        {/* Section 5: Interactive Doctrine (Flow of a Task) */}
        <section className="py-20 border-b border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">TIMELINE // DOCTRINE_FLOW</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-4">HOW A TASK FLOWS</h2>
          <p className="text-white/60 text-lg font-light max-w-3xl leading-relaxed mb-16">
            The LUMI task lifecycle is human-in-the-loop by design. Here is the operational progression from user prompt to complete validation:
          </p>

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Step list - Column 5 */}
            <div className="lg:col-span-5 space-y-3">
              {taskFlowSteps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-4 border transition-all relative flex items-center justify-between rounded-none cursor-pointer ${
                    activeStep === idx 
                      ? 'bg-primary/5 border-primary text-white' 
                      : 'bg-white/2 border-white/5 text-white/40 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-black w-6 h-6 flex items-center justify-center border ${
                      activeStep === idx ? 'border-primary text-primary' : 'border-white/20 text-white/30'
                    }`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-widest">{step.title}</div>
                      <div className="text-[9px] font-mono opacity-60 uppercase">{step.actor} &mdash; {step.status}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeStep === idx ? 'rotate-90 text-primary' : ''}`} />
                </button>
              ))}
            </div>

            {/* Step description detail view - Column 7 */}
            <div className="lg:col-span-7 bg-[#0C0C0D] border border-white/10 p-8 flex flex-col justify-between relative rounded-none">
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-white/20">
                ACTIVE_STEP // 0{activeStep + 1}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] font-bold">
                    {taskFlowSteps[activeStep].actor} &bull; {taskFlowSteps[activeStep].status}
                  </div>
                  <h3 className="text-3xl font-display font-black text-white uppercase tracking-tight leading-none">
                    {taskFlowSteps[activeStep].title}
                  </h3>
                </div>

                <Separator className="bg-white/5" />

                <div className="space-y-4">
                  <p className="text-white/60 text-sm font-sans font-light leading-relaxed">
                    {taskFlowSteps[activeStep].desc}
                  </p>
                  <div className="bg-black/50 border border-white/5 p-4 font-mono text-xs text-white/80">
                    <div className="text-[9px] text-white/30 uppercase tracking-widest mb-1">// Details & Logic</div>
                    {taskFlowSteps[activeStep].details}
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between text-[10px] font-mono text-white/40">
                <div className="flex items-center gap-2">
                  <Workflow size={14} className="text-primary" /> Human-in-the-loop Guardrail
                </div>
                <span>Step {activeStep + 1} of 6</span>
              </div>
            </div>

          </div>
        </section>

        {/* Section 6: Capabilities Console (Tabs layout with Interactive Typer & Model Router) */}
        <section className="py-20 border-b border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">CAPABILITIES // SYSTEM_CONSOLE</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-12">CAPABILITIES CONSOLE</h2>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4 relative">
            {[
              { id: 'modes', label: 'Plan & Act Modes' },
              { id: 'commands', label: 'Slash Commands' },
              { id: 'mentions', label: '@ Mentions' },
              { id: 'hooks', label: 'Lifecycle Hooks' },
              { id: 'roadmap', label: 'Roadmap Steering' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all relative rounded-none cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-black border-primary font-black z-10'
                    : 'bg-white/2 border-white/5 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-[#0C0C0D] border border-white/10 p-8 min-h-[420px] flex flex-col justify-between animate-fade-in rounded-none">
            <AnimatePresence mode="wait">
              {activeTab === 'modes' && (
                <motion.div
                  key="modes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
                >
                  {/* Left: Router Configurator & MCP playground */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-white">LLM Provider Configurator</h3>
                    <div className="space-y-4">
                      {/* Plan Mode Settings */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Plan Mode API Provider</label>
                        <div className="flex gap-2">
                          {['openrouter', 'openai', 'nous', 'cloudflare'].map((prov) => (
                            <button
                              key={prov}
                              onClick={() => setPlanProvider(prov as any)}
                              className={`px-3 py-1.5 font-mono text-[9px] uppercase border tracking-wider transition-all rounded-none cursor-pointer ${
                                planProvider === prov
                                  ? 'bg-primary text-black border-primary font-bold'
                                  : 'bg-white/2 border-white/5 text-white/40 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {prov}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Act Mode Settings */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Act Mode API Provider</label>
                        <div className="flex gap-2">
                          {['openrouter', 'openai', 'nous', 'cloudflare'].map((prov) => (
                            <button
                              key={prov}
                              onClick={() => setActProvider(prov as any)}
                              className={`px-3 py-1.5 font-mono text-[9px] uppercase border tracking-wider transition-all rounded-none cursor-pointer ${
                                actProvider === prov
                                  ? 'bg-primary text-black border-primary font-bold'
                                  : 'bg-white/2 border-white/5 text-white/40 hover:text-white hover:border-white/20'
                              }`}
                            >
                              {prov}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Expandable MCP Servers selector */}
                    <Separator className="bg-white/5" />
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Wired Model Context Protocol (MCP) servers</h4>
                      <div className="flex flex-wrap gap-3">
                        {['sqlite', 'github', 'filesystem'].map((mcp) => (
                          <button
                            key={mcp}
                            onClick={() => toggleMcpServer(mcp as any)}
                            className={`px-4 py-2 border transition-all flex items-center gap-2 rounded-none cursor-pointer ${
                              connectedMcps[mcp as keyof typeof connectedMcps]
                                ? 'bg-[#00FF66]/10 border-primary text-white font-semibold'
                                : 'bg-white/2 border-white/5 text-white/40 hover:text-white'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${connectedMcps[mcp as keyof typeof connectedMcps] ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                            <span className="font-mono text-[9px] uppercase tracking-widest">mcp://{mcp}-server</span>
                          </button>
                        ))}
                      </div>

                      {/* Interactive MCP tool tester */}
                      <div className="bg-black/45 border border-white/5 p-4 space-y-4">
                        <div className="text-[9px] font-mono text-primary uppercase tracking-widest font-bold">// Interactive MCP Tools Playground</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-white/30 block uppercase">Active MCP Source</label>
                            <select 
                              value={mcpSelectedServer}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setMcpSelectedServer(val);
                                const defaultTool = mcpToolsList[val][0].name;
                                setMcpSelectedTool(defaultTool);
                                setMcpArguments(mcpToolsList[val][0].args);
                              }}
                              className="bg-[#0C0C0D] border border-white/10 text-white/80 p-2 font-mono text-[10px] w-full rounded-none outline-none focus:border-primary/50"
                            >
                              <option value="sqlite">mcp://sqlite-server</option>
                              <option value="github">mcp://github-server</option>
                              <option value="filesystem">mcp://filesystem-server</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-white/30 block uppercase">Select Schema Tool</label>
                            <select 
                              value={mcpSelectedTool}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMcpSelectedTool(val);
                                const match = mcpToolsList[mcpSelectedServer].find(t => t.name === val);
                                if (match) setMcpArguments(match.args);
                              }}
                              className="bg-[#0C0C0D] border border-white/10 text-white/80 p-2 font-mono text-[10px] w-full rounded-none outline-none focus:border-primary/50"
                            >
                              {mcpToolsList[mcpSelectedServer].map(t => (
                                <option key={t.name} value={t.name}>{t.name} ({t.desc.substring(0, 20)}...)</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-mono text-white/30">
                            <span className="uppercase">JSON Tool Parameters</span>
                            <span className="text-white/20">args schema: Object</span>
                          </div>
                          <textarea 
                            value={mcpArguments}
                            onChange={(e) => setMcpArguments(e.target.value)}
                            rows={3}
                            className="bg-black/50 border border-white/10 text-emerald-400 font-mono text-[10px] w-full p-3 rounded-none focus:outline-none focus:border-primary/50"
                          />
                        </div>

                        <div className="flex justify-between items-center gap-4">
                          <Button 
                            onClick={executeMcpTest}
                            disabled={mcpExecuting || !connectedMcps[mcpSelectedServer]}
                            className="bg-primary text-black font-black font-mono text-[9px] uppercase tracking-widest h-9 rounded-none disabled:opacity-40 cursor-pointer"
                          >
                            {mcpExecuting ? 'Executing Tool...' : !connectedMcps[mcpSelectedServer] ? 'Server Offline' : 'Execute Test Tool'}
                          </Button>
                          <span className="text-[8px] font-mono text-white/20">Gated tool authorizations apply.</span>
                        </div>

                        {/* MCP tool output panel */}
                        {mcpResult && (
                          <div className="space-y-1.5 animate-fade-in">
                            <div className="text-[8px] font-mono text-white/30 uppercase">Test Result Payload</div>
                            <pre className="bg-[#0A0A0B] border border-white/5 p-3 text-[10px] font-mono text-white/70 overflow-x-auto max-h-[140px] custom-scrollbar">
                              <code>{mcpResult}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Simulated Provider Config Metrics with Waveform */}
                  <div className="lg:col-span-5 bg-black border border-white/10 p-6 flex flex-col justify-between min-h-[300px] rounded-none">
                    <div className="space-y-6">
                      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest flex items-center justify-between">
                        <span>Configured Route State</span>
                        <span className="text-primary font-bold">STABLE</span>
                      </div>

                      {/* Plan model indicators */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-white/40 uppercase">// Plan Mode Model</span>
                          <span className="text-primary font-bold">{planMetrics?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-white/50">
                          <div>Reasoning: <span className="text-white font-bold">{planMetrics?.reasoning}%</span></div>
                          <div>Cost: <span className="text-white font-bold">{planMetrics?.cost}</span></div>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${planMetrics?.reasoning}%` }} />
                        </div>
                      </div>

                      {/* Act model indicators */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-white/40 uppercase">// Act Mode Model</span>
                          <span className="text-primary font-bold">{actMetrics?.name}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 font-mono text-[9px] text-white/50">
                          <div>Reasoning: <span className="text-white font-bold">{actMetrics?.reasoning}%</span></div>
                          <div>Speed: <span className="text-white font-bold">{actMetrics?.speed}%</span></div>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${actMetrics?.speed}%` }} />
                        </div>
                      </div>

                      {/* Live Latency Waveform visualizer */}
                      {renderLatencyGraph()}

                      {/* MCP output log */}
                      {mcpLog.length > 0 && (
                        <div className="pt-2 border-t border-white/5">
                          <div className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">MCP Connection Logger</div>
                          <div className="bg-black border border-white/5 p-2 font-mono text-[9px] text-white/40 max-h-[80px] overflow-y-auto custom-scrollbar leading-tight">
                            {mcpLog.slice(-3).map((log, idx) => (
                              <div key={idx}>{log}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-[8px] text-white/20 uppercase tracking-widest text-right mt-6">
                      LUMI Router Provider Routing Engine
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'commands' && (
                <motion.div
                  key="commands"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full"
                >
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 px-4 py-2">
                      <Command size={14} className="text-white/40" />
                      <input 
                        type="text"
                        placeholder="FILTER COMMANDS..."
                        value={commandQuery}
                        onChange={(e) => setCommandQuery(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 text-[10px] uppercase font-mono tracking-widest w-full font-mono outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCommands.length > 0 ? (
                        filteredCommands.map((cmd, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => runCommandSimulation(cmd.name)}
                            disabled={cmdRunning}
                            className="bg-white/2 border border-white/5 p-3 flex flex-col justify-between hover:border-primary/30 text-left transition-colors group/cmd disabled:opacity-50 rounded-none cursor-pointer"
                          >
                            <code className="text-primary text-[11px] font-mono font-bold mb-1 flex items-center justify-between w-full">
                              <span>{cmd.name}</span>
                              <Play size={8} className="opacity-0 group-hover/cmd:opacity-100 transition-opacity text-primary" />
                            </code>
                            <p className="text-white/50 font-sans text-[10px] font-light leading-snug">{cmd.purpose}</p>
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 py-8 text-center text-[10px] font-mono text-white/30 uppercase">No matching slash commands found.</div>
                      )}
                    </div>
                  </div>

                  {/* Right side: Terminal typer simulation */}
                  <div className="lg:col-span-5 bg-black border border-white/10 p-5 font-mono text-xs flex flex-col justify-between min-h-[240px] rounded-none">
                    <div>
                      <div className="flex justify-between items-center text-[9px] text-white/30 uppercase mb-4 tracking-wider">
                        <span>Terminal Execution Log</span>
                        <span className="text-primary">{cmdRunning ? 'RUNNING' : 'IDLE'}</span>
                      </div>
                      <div className="space-y-3 font-mono text-[11px]">
                        <div className="flex items-center gap-1">
                          <span className="text-primary">$</span>
                          <span>{cmdInputText}</span>
                          {cmdRunning && <span className="w-1.5 h-3 bg-primary animate-pulse" />}
                        </div>
                        <div className="space-y-1 text-white/50 font-mono">
                          {cmdOutput.map((out, idx) => (
                            <div key={idx} className="animate-fade-in">{out}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-[8px] text-white/20 uppercase tracking-widest text-right mt-6">
                      Click a command block to execute
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'mentions' && (
                <motion.div
                  key="mentions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p className="text-white/60 text-sm font-sans font-light leading-relaxed max-w-3xl">
                    Type `@` in LUMI chat to attach specific context elements. This prevents token bloat and keeps context focused.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mentions.map((mention, idx) => (
                      <div key={idx} className="bg-white/2 border border-white/5 p-4 flex flex-col justify-between rounded-none">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <code className="bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white font-bold">{mention.name}</code>
                            <span className="text-[8px] font-mono text-primary uppercase tracking-widest">{mention.type}</span>
                          </div>
                          <p className="text-white/50 font-sans text-xs font-light leading-snug">{mention.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'hooks' && (
                <motion.div
                  key="hooks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p className="text-white/60 text-sm font-sans font-light leading-relaxed max-w-3xl">
                    Hook integrations (defined inside `src/core/hooks/utils.ts`) run validation scripts. These hooks can intercept actions (e.g., block tool execution based on customized criteria).
                  </p>

                  {/* Interactive Lifecycle Hook Playground */}
                  <div className="bg-black/35 border border-white/5 p-5 space-y-4">
                    <div className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">// Configure Sandbox Lifecycle Hook Rules</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/30 block uppercase">Hook Event</label>
                        <select 
                          value={hookType}
                          onChange={(e) => setHookType(e.target.value as any)}
                          className="bg-[#0C0C0D] border border-white/10 text-white/80 p-2 font-mono text-[10px] w-full rounded-none outline-none focus:border-primary/50"
                        >
                          <option value="PreToolUse">PreToolUse (Fires before file writes)</option>
                          <option value="TaskComplete">TaskComplete (Fires on task finish)</option>
                          <option value="UserPromptSubmit">UserPromptSubmit (Fires on chat input)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-white/30 block uppercase">Action Policy</label>
                        <select 
                          value={hookPolicy}
                          onChange={(e) => setHookPolicy(e.target.value as any)}
                          className="bg-[#0C0C0D] border border-white/10 text-white/80 p-2 font-mono text-[10px] w-full rounded-none outline-none focus:border-primary/50"
                        >
                          <option value="allow">ALLOW (Pass checks & log)</option>
                          <option value="warn">WARN (Trigger warning prompts)</option>
                          <option value="block">BLOCK (Intercept and reject action)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 flex flex-col justify-end">
                        <div className="text-[8px] font-mono text-white/40 leading-tight">
                          Configure hook policy, then click "Initialize Task" &bull; "Start Plan" &bull; "Transition to Act" in the sandbox above to see it intercept execution blocks.
                        </div>
                      </div>
                    </div>

                    {/* Active Hook Logs panel */}
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[8px] font-mono text-white/30 uppercase block mb-1">Active Interceptor Audits Logger</span>
                      <div className="bg-black p-3 font-mono text-[10px] text-white/50 min-h-[60px] max-h-[100px] overflow-y-auto custom-scrollbar space-y-1 leading-snug">
                        {hookLogs.length > 0 ? (
                          hookLogs.map((log, idx) => <div key={idx} className="text-yellow-400">{log}</div>)
                        ) : (
                          <div className="text-white/20 italic">Logger waiting for lifecycle executions...</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {hooks.map((hook, idx) => (
                      <div key={idx} className="bg-white/2 border border-white/5 p-4 flex flex-col justify-between hover:border-primary/20 transition-colors rounded-none">
                        <div>
                          <div className="text-[10px] font-mono font-bold text-white mb-2 uppercase tracking-wide">{hook.name}</div>
                          <p className="text-white/50 font-sans text-[11px] font-light leading-relaxed">{hook.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <p className="text-white/60 text-sm font-sans font-light leading-relaxed max-w-3xl font-sans">
                    LUMI roadmap steering uses `ROADMAP.md` in the project root to control progress. Completion is blocked unless milestones are achieved and verified.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Configuration Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roadmapSettings.map((sett, idx) => (
                        <div key={idx} className="bg-white/2 border border-white/5 p-4 flex flex-col justify-between rounded-none">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <code className="text-primary text-[11px] font-mono font-bold">{sett.key}</code>
                              <span className="text-[8px] font-mono bg-white/5 border border-white/10 px-1 text-white/40 font-mono">Default: {sett.default}</span>
                            </div>
                            <p className="text-white/60 font-sans text-xs font-light leading-relaxed">{sett.purpose}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="h-px bg-white/10 w-full mt-8 mb-4"></div>
            <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
              LUMI_SYSTEM_CAPABILITIES_REGISTERED // 2026
            </div>
          </div>
        </section>

        {/* Section 7: Security & Trust Model */}
        <section className="py-20 border-b border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">SECURITY // BOUNDARIES</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-12">THE TRUST MODEL</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'No Silent Writes',
                desc: 'Every mutating tool call must present a side-by-side diff in the editor workspace. The agent halts and waits for manual user approval before writing changes to disk.',
                icon: <Lock className="text-primary mb-4" size={20} />
              },
              {
                title: 'Context Exclusions',
                desc: '`.dietcodeignore` prevents code scanning in directories like node_modules/, builds/, dist/, and local storage, protecting bandwidth, performance, and tokens.',
                icon: <Shield className="text-primary mb-4" size={20} />
              },
              {
                title: 'Fail-Closed Gates',
                desc: 'When validation fails or custom checks crash, completion pipelines block. LUMI prevents broken configurations from completing, keeping builds green.',
                icon: <AlertTriangle className="text-primary mb-4" size={20} />
              }
            ].map((box, idx) => (
              <div key={idx} className="bg-white/2 border border-white/5 p-6 hover:border-primary/20 transition-all rounded-none">
                {box.icon}
                <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-2">{box.title}</h3>
                <p className="text-white/50 font-sans text-xs font-light leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8: Monorepo & Technical Architecture */}
        <section className="py-20 border-b border-white/5">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">ARCHITECTURE // LAYOUT</div>
          <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-4">ARCHITECTURE AT A GLANCE</h2>
          <p className="text-white/60 text-lg font-light max-w-3xl leading-relaxed mb-16 font-sans">
            LUMI is structured as a TypeScript monorepo splitting the VS Code extension host from the state context databases. Hover components to highlight data pathways.
          </p>

          <div className="space-y-8">
            {/* Animated flowchart */}
            {renderArchitectureFlow()}

            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* Left Col: Technical Specs */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest">MONOREPO PACKAGES</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="bg-white/2 border border-white/5 p-4 rounded-none">
                    <div className="font-bold text-primary mb-1">lumi-vscode</div>
                    <div className="text-white/40 text-[9px] mb-2">PATH: repo root (workspace)</div>
                    <p className="text-white/60 font-sans text-xs font-light leading-snug">VS Code agent host, holding tasks loop, active settings, custom tools handlers, and React sidebars.</p>
                  </div>
                  <div className="bg-white/2 border border-white/5 p-4 rounded-none">
                    <div className="font-bold text-primary mb-1">@noorm/broccolidb</div>
                    <div className="text-white/40 text-[9px] mb-2">PATH: broccolidb/</div>
                    <p className="text-white/60 font-sans text-xs font-light leading-snug">Context databases engine. Handles structural auditing, spider mapping policies, and binary schema SQLite serialization.</p>
                  </div>
                </div>

                <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest pt-4">TECHS SURFACE</h3>
                <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-white/60">
                  <div className="bg-white/2 border border-white/5 p-3 rounded-none">
                    <span className="text-white/30 block mb-1">Host</span>
                    <span className="font-bold text-white">TypeScript / ESBuild</span>
                  </div>
                  <div className="bg-white/2 border border-white/5 p-3 rounded-none">
                    <span className="text-white/30 block mb-1">Webview UI</span>
                    <span className="font-bold text-white">React / Vite</span>
                  </div>
                  <div className="bg-white/2 border border-white/5 p-3 rounded-none">
                    <span className="text-white/30 block mb-1">IPC Bridge</span>
                    <span className="font-bold text-white">Protobuf / gRPC</span>
                  </div>
                  <div className="bg-white/2 border border-white/5 p-3 rounded-none">
                    <span className="text-white/30 block mb-1">Database</span>
                    <span className="font-bold text-white">better-sqlite3</span>
                  </div>
                </div>
              </div>

              {/* Right Col: Setup commands */}
              <div className="lg:col-span-7 bg-[#0C0C0D] border border-white/10 p-8 flex flex-col justify-between rounded-none">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <GitBranch size={16} className="text-primary" />
                    <h3 className="text-lg font-bold uppercase tracking-tight text-white">DEVELOPER BOOTSTRAPPING</h3>
                  </div>

                  <p className="text-white/60 font-sans text-xs font-light leading-relaxed">
                    To set up a local development build of LUMI inside VS Code, clone the repository and build the protobuf definitions before loading:
                  </p>

                  <div className="bg-black/80 border border-white/5 p-4 font-mono text-[11px] space-y-2 text-white/70 overflow-x-auto">
                    <div><span className="text-primary font-bold">git clone</span> https://github.com/CardSorting/DietCodeMarie.git</div>
                    <div><span className="text-primary font-bold">cd</span> DietCodeMarie</div>
                    <div className="text-white/40">// Install dependencies for extension + webview</div>
                    <div><span className="text-primary font-bold">npm run</span> install:all</div>
                    <div className="text-white/40">// Compile gRPC host bridge definitions (Required)</div>
                    <div><span className="text-primary font-bold">npm run</span> protos</div>
                    <div className="text-white/40">// Launch file watch compile typechecks</div>
                    <div><span className="text-primary font-bold">npm run</span> dev</div>
                    <div className="text-white/40">// (Optional) Launch webview HMR watch hot-reload</div>
                    <div><span className="text-primary font-bold">npm run</span> dev:webview</div>
                  </div>

                  <div className="bg-yellow-400/5 border border-yellow-400/10 p-4 flex gap-3 items-start">
                    <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-sans font-light text-white/50">
                      **Diagnostics:** Press F5 inside VS Code to launch an "Extension Development Host" containing your local build. Run `npm run ci:check-all` to execute tests, linters, roadmap checks, and document link checkers locally.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center text-[10px] font-mono text-white/40">
                  <span>Ref: docs/PROJECT_MAP.md</span>
                  <span className="text-primary font-mono font-bold">RUN_PROTOS_REQUIRED</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 10: FAQ & Help */}
        <section className="py-20">
          <div className="text-[10px] uppercase font-mono tracking-[0.4em] text-primary font-bold mb-4">FAQ // TROUBLESHOOTING</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-display font-black tracking-tighter uppercase">FAQ & DIAGNOSTICS</h2>
              <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl font-sans">
                Troubleshooting guidelines and details on provider routing, shadow checkpoints, and codebase licensing.
              </p>
            </div>
            {/* Live Search filter for FAQs */}
            <div className="flex items-center gap-2 bg-white/2 border border-white/10 px-4 py-2 font-mono text-xs w-full max-w-xs shrink-0 rounded-none">
              <Search size={14} className="text-white/30" />
              <input 
                type="text"
                placeholder="SEARCH FAQ RECORDS..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 uppercase tracking-widest text-[9px] w-full font-mono outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 max-w-4xl font-sans">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 p-6 transition-all rounded-none">
                  <div className="flex items-center justify-between text-left group">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="flex-1 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                    >
                      <h3 className="text-sm font-bold uppercase tracking-wide text-white group-hover:text-primary transition-colors pr-4">
                        {faq.q}
                      </h3>
                      <HelpCircle size={16} className={`text-white/40 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    
                    {/* Thumbs Feedback Rating with Spring effect */}
                    <div className="flex items-center gap-3 ml-4 shrink-0 font-mono text-[9px] text-white/40">
                      <motion.button 
                        whileTap={{ scale: 1.3, y: -2 }}
                        onClick={() => handleFaqVote(idx, 'up')}
                        className={`flex items-center gap-1 hover:text-emerald-400 transition-colors p-1 cursor-pointer ${
                          faqVotes[idx]?.voted === 'up' ? 'text-emerald-400 font-bold' : ''
                        }`}
                        title="Mark as helpful"
                      >
                        <ThumbsUp size={11} />
                        <span>{faqVotes[idx]?.up}</span>
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 1.3, y: 2 }}
                        onClick={() => handleFaqVote(idx, 'down')}
                        className={`flex items-center gap-1 hover:text-red-400 transition-colors p-1 cursor-pointer ${
                          faqVotes[idx]?.voted === 'down' ? 'text-red-400 font-bold' : ''
                        }`}
                        title="Mark as unhelpful"
                      >
                        <ThumbsDown size={11} />
                        <span>{faqVotes[idx]?.down}</span>
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/50 text-xs font-light leading-relaxed pt-4 border-t border-white/5 mt-4 font-sans">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="py-12 border border-dashed border-white/10 font-mono text-[10px] text-white/30 uppercase text-center rounded-none">
                No matching FAQ registry files found.
              </div>
            )}
          </div>

          {/* Feedback bottom bar */}
          <div className="mt-16 bg-[#0C0C0D] border border-white/10 p-8 flex flex-col md:flex-row gap-6 items-center justify-between rounded-none">
            <div className="space-y-2">
              <h4 className="text-lg font-bold uppercase tracking-tight text-white font-sans">Need Additional Assistance?</h4>
              <p className="text-white/50 text-xs font-sans max-w-2xl font-light">
                Submit issue queries directly on our GitHub page or consult private policies at `SECURITY.md`. Send private reports directly to `security@dietcode.bot` with diagnostic logs.
              </p>
            </div>
            <a 
              href="mailto:security@dietcode.bot"
              className="px-6 py-3 bg-primary text-black font-black uppercase tracking-widest text-[10px] hover:bg-white transition-colors font-mono rounded-none"
            >
              Report Vulnerability
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
