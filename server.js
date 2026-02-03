
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const WORKSPACE = path.join(__dirname, 'workspace');

app.use(cors());
app.use(express.json());

// Ensure workspace exists
fs.ensureDirSync(WORKSPACE);

// 1. API ROUTES
app.get('/api/files', async (req, res) => {
    try {
        const files = await fs.readdir(WORKSPACE);
        const data = await Promise.all(files.map(async name => ({
            id: name,
            name,
            language: name.split('.').pop(),
            content: await fs.readFile(path.join(WORKSPACE, name), 'utf8')
        })));
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/files/save', async (req, res) => {
    const { name, content } = req.body;
    try {
        await fs.writeFile(path.join(WORKSPACE, name), content);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/run', (req, res) => {
    const { code, language, fileName } = req.body;
    const filePath = path.join(WORKSPACE, fileName);
    
    fs.writeFileSync(filePath, code);

    let command = '';
    const lang = (language || '').toLowerCase();

    if (lang === 'python' || fileName.endsWith('.py')) command = `python3 ${filePath}`;
    else if (lang === 'javascript' || lang === 'js' || fileName.endsWith('.js')) command = `node ${filePath}`;
    else if (lang === 'c++' || lang === 'cpp') command = `g++ ${filePath} -o ${filePath}.out && ${filePath}.out`;
    else if (lang === 'c') command = `gcc ${filePath} -o ${filePath}.out && ${filePath}.out`;
    else if (lang === 'rust') command = `rustc ${filePath} -o ${filePath}.out && ${filePath}.out`;
    else if (lang === 'java') command = `javac ${filePath} && java -cp ${WORKSPACE} ${fileName.replace('.java', '')}`;
    else if (lang === 'go') command = `go run ${filePath}`;
    else if (lang === 'php') command = `php ${filePath}`;
    else if (lang === 'ruby') command = `ruby ${filePath}`;
    else {
        return res.status(400).json({ error: `Local binary for ${language} not found. Using Neural fallback...` });
    }

    exec(command, (error, stdout, stderr) => {
        res.json({
            output: stdout,
            error: stderr || (error ? error.message : null)
        });
    });
});

// 2. FRONTEND SERVING
// Serve static files from the root directory
app.use(express.static(__dirname));

// Catch-all route to serve the IDE for any client-side route
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return; // Don't intercept API calls
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.clear();
    console.log(`
\x1b[35m    __    _         __  __      __  
   / /   (_)       / / / /_  __/ /_ 
  / /   / /       / /_/ / / / / __ \\
 / /___/ /       / __  / /_/ / /_/ /
/_____/_/       /_/ /_/\\__,_/_.___/ \x1b[0m
                                    
\x1b[36m[SYSTEM]\x1b[0m UNIFIED NEURAL IDE v6.0
\x1b[32m[STATUS]\x1b[0m ONLINE AND READY

\x1b[33m--- ACCESS PROTOCOLS ---\x1b[0m
Local Access:  \x1b[4mhttp://localhost:${PORT}\x1b[0m
Termux IP:     \x1b[4mhttp://0.0.0.0:${PORT}\x1b[0m

\x1b[36m[LOGS]\x1b[0m
- Polyglot Engine: Active (Python, Node, C++, Rust, Go)
- Neural Gateway: Connected (Gemini 3 Pro)
- Workspace: ${WORKSPACE}
    `);
});
