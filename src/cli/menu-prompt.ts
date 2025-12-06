/**
 * Cross-platform menu prompt system with arrow key navigation
 * Works in both Node.js CLI and browser environments
 */

export interface MenuOption {
  label: string;
  value: any;
  description?: string;
}

export interface MenuPromptOptions {
  message?: string;
  options: MenuOption[];
  defaultIndex?: number;
}

export interface MenuPromptResult {
  selectedIndex: number;
  selectedValue: any;
  selectedOption: MenuOption;
}

/**
 * Platform-agnostic menu prompt interface
 */
export interface IMenuPrompt {
  show(options: MenuPromptOptions): Promise<MenuPromptResult>;
  cleanup(): void;
}

/**
 * Create a menu prompt instance based on the current environment
 */
export function createMenuPrompt(): IMenuPrompt {
  if (typeof window !== 'undefined') {
    // Browser environment
    return new BrowserMenuPrompt();
  } else {
    // Node.js environment
    return new NodeMenuPrompt();
  }
}

/**
 * Browser implementation of menu prompt
 */
class BrowserMenuPrompt implements IMenuPrompt {
  private menuContainer: HTMLElement | null = null;
  private selectedIndex: number = 0;
  private options: MenuOption[] = [];
  private resolve: ((result: MenuPromptResult) => void) | null = null;
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  async show(options: MenuPromptOptions): Promise<MenuPromptResult> {
    return new Promise((resolve) => {
      this.options = options.options;
      this.selectedIndex = options.defaultIndex ?? 0;
      this.resolve = resolve;

      // Create menu container
      this.menuContainer = document.createElement('div');
      this.menuContainer.className = 'menu-prompt';
      this.menuContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #252526;
        border: 1px solid #3e3e42;
        border-radius: 4px;
        padding: 20px;
        min-width: 400px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 2000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      `;

      // Create backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'menu-prompt-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1999;
      `;

      // Create message
      if (options.message) {
        const messageEl = document.createElement('div');
        messageEl.textContent = options.message;
        messageEl.style.cssText = `
          color: #4ec9b0;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #3e3e42;
        `;
        this.menuContainer.appendChild(messageEl);
      }

      // Create options list
      const optionsList = document.createElement('div');
      optionsList.className = 'menu-options';
      this.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'menu-option';
        optionEl.dataset.index = index.toString();
        optionEl.style.cssText = `
          padding: 10px 15px;
          margin: 5px 0;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          flex-direction: column;
        `;

        const labelEl = document.createElement('div');
        labelEl.textContent = option.label;
        labelEl.style.cssText = `
          color: #d4d4d4;
          font-size: 14px;
        `;

        if (option.description) {
          const descEl = document.createElement('div');
          descEl.textContent = option.description;
          descEl.style.cssText = `
            color: #858585;
            font-size: 12px;
            margin-top: 4px;
          `;
          optionEl.appendChild(labelEl);
          optionEl.appendChild(descEl);
        } else {
          optionEl.appendChild(labelEl);
        }

        optionEl.addEventListener('click', () => {
          this.selectOption(index);
        });

        optionsList.appendChild(optionEl);
      });

      this.menuContainer.appendChild(optionsList);

      // Create instructions
      const instructions = document.createElement('div');
      instructions.textContent = 'Use ↑↓ arrows to navigate, Enter to select, Esc to cancel';
      instructions.style.cssText = `
        color: #858585;
        font-size: 11px;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #3e3e42;
        text-align: center;
      `;
      this.menuContainer.appendChild(instructions);

      backdrop.appendChild(this.menuContainer);
      document.body.appendChild(backdrop);

      // Handle keyboard events
      this.keyHandler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
          this.updateSelection();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
          this.updateSelection();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.selectOption(this.selectedIndex);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.cleanup();
          resolve({
            selectedIndex: -1,
            selectedValue: null,
            selectedOption: { label: '', value: null },
          });
        }
      };

      document.addEventListener('keydown', this.keyHandler);

      // Update initial selection
      this.updateSelection();
    });
  }

  private updateSelection() {
    if (!this.menuContainer) return;

    const options = this.menuContainer.querySelectorAll('.menu-option');
    options.forEach((el, index) => {
      const optionEl = el as HTMLElement;
      if (index === this.selectedIndex) {
        optionEl.style.backgroundColor = '#0e639c';
        optionEl.style.color = '#ffffff';
      } else {
        optionEl.style.backgroundColor = 'transparent';
        optionEl.style.color = '#d4d4d4';
      }
    });
  }

  private selectOption(index: number) {
    if (this.resolve && index >= 0 && index < this.options.length) {
      const result: MenuPromptResult = {
        selectedIndex: index,
        selectedValue: this.options[index].value,
        selectedOption: this.options[index],
      };
      this.cleanup();
      this.resolve(result);
    }
  }

  cleanup(): void {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }

    const backdrop = document.querySelector('.menu-prompt-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    this.menuContainer = null;
    this.resolve = null;
  }
}

/**
 * Node.js implementation of menu prompt using readline
 */
class NodeMenuPrompt implements IMenuPrompt {
  private stdin: any = null;
  private keyHandler: ((key: string) => void) | null = null;
  private escapeTimeout: NodeJS.Timeout | null = null;

  async show(options: MenuPromptOptions): Promise<MenuPromptResult> {
    const { stdin, stdout } = process;

    if (!stdin.isTTY) {
      // Fallback for non-TTY environments: show a simple numbered list
      return new Promise((resolve) => {
        if (options.message) {
          stdout.write(`${options.message}\n\n`);
        }
        
        options.options.forEach((option, index) => {
          stdout.write(`${index + 1}. ${option.label}`);
          if (option.description) {
            stdout.write(` - ${option.description}`);
          }
          stdout.write('\n');
        });
        
        stdout.write('\nPlease run this command directly in your terminal (not through npm) to use the interactive menu.\n');
        stdout.write('Or provide a profile ID: bfg user-details <profile-id>\n');
        
        resolve({
          selectedIndex: -1,
          selectedValue: null,
          selectedOption: { label: '', value: null },
        });
      });
    }

    // Store original raw mode state
    const wasRawMode = stdin.isRaw || false;

    // Set up raw mode for keypress handling
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    return new Promise((resolve) => {
      let selectedIndex = options.defaultIndex ?? 0;
      const menuOptions = options.options;
      let buffer = '';

      // Display menu
      const displayMenu = () => {
        // Clear screen and move cursor to top
        stdout.write('\x1b[2J\x1b[H');

        if (options.message) {
          stdout.write(`\x1b[36m${options.message}\x1b[0m\n\n`);
        }

        menuOptions.forEach((option, index) => {
          const prefix = index === selectedIndex ? '\x1b[1m\x1b[32m> \x1b[0m' : '  ';
          const label = index === selectedIndex ? `\x1b[1m${option.label}\x1b[0m` : option.label;
          stdout.write(`${prefix}${label}`);
          if (option.description) {
            stdout.write(` \x1b[90m- ${option.description}\x1b[0m`);
          }
          stdout.write('\n');
        });

        stdout.write('\n\x1b[90mUse ↑↓ arrows to navigate, Enter to select, Esc to cancel\x1b[0m\n');
      };

      displayMenu();

      this.keyHandler = (key: string) => {
        // Handle escape sequences (arrow keys)
        // Arrow keys come as '\u001b[A' (up), '\u001b[B' (down), etc.
        // They might come as a single string or multiple characters
        
        // Check if this is a complete escape sequence
        if (key.startsWith('\u001b[')) {
          buffer = '';
          const lastChar = key[key.length - 1];
          if (lastChar === 'A') {
            // Arrow Up
            selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
            displayMenu();
          } else if (lastChar === 'B') {
            // Arrow Down
            selectedIndex = (selectedIndex + 1) % menuOptions.length;
            displayMenu();
          }
          return;
        }

        // Handle partial escape sequences (character by character)
        if (key === '\u001b') {
          buffer = '\u001b';
          // Set a timeout - if no next character arrives within 50ms, treat as standalone Escape
          if (this.escapeTimeout) {
            clearTimeout(this.escapeTimeout);
          }
          this.escapeTimeout = setTimeout(() => {
            if (buffer === '\u001b') {
              // Standalone Escape key - cancel
              buffer = '';
              this.cleanup(wasRawMode);
              resolve({
                selectedIndex: -1,
                selectedValue: null,
                selectedOption: { label: '', value: null },
              });
            }
          }, 50);
          return;
        }

        // Clear escape timeout if we got a character after escape
        if (this.escapeTimeout) {
          clearTimeout(this.escapeTimeout);
          this.escapeTimeout = null;
        }

        if (buffer === '\u001b') {
          if (key === '[') {
            buffer = '\u001b[';
            return;
          } else {
            // Just Escape key (pressed alone, not part of arrow key sequence)
            buffer = '';
            this.cleanup(wasRawMode);
            resolve({
              selectedIndex: -1,
              selectedValue: null,
              selectedOption: { label: '', value: null },
            });
            return;
          }
        }

        if (buffer === '\u001b[') {
          buffer = '';
          if (key === 'A') {
            // Arrow Up
            selectedIndex = (selectedIndex - 1 + menuOptions.length) % menuOptions.length;
            displayMenu();
          } else if (key === 'B') {
            // Arrow Down
            selectedIndex = (selectedIndex + 1) % menuOptions.length;
            displayMenu();
          }
          return;
        }

        buffer = '';

        // Handle special keys
        if (key === '\u0003') {
          // Ctrl+C
          this.cleanup(wasRawMode);
          process.exit(0);
        } else if (key === '\r' || key === '\n') {
          // Enter
          this.cleanup(wasRawMode);
          resolve({
            selectedIndex,
            selectedValue: menuOptions[selectedIndex].value,
            selectedOption: menuOptions[selectedIndex],
          });
        }
      };

      stdin.on('data', this.keyHandler);
      this.stdin = stdin;
    });
  }

  cleanup(restoreRawMode?: boolean): void {
    if (this.escapeTimeout) {
      clearTimeout(this.escapeTimeout);
      this.escapeTimeout = null;
    }
    if (this.keyHandler && this.stdin) {
      this.stdin.removeListener('data', this.keyHandler);
      this.keyHandler = null;
    }
    if (this.stdin) {
      if (this.stdin.isTTY) {
        this.stdin.setRawMode(restoreRawMode ?? false);
      }
      this.stdin.pause();
    }
    this.stdin = null;
  }
}

/**
 * Convenience function to show a menu prompt
 */
export async function showMenuPrompt(options: MenuPromptOptions): Promise<MenuPromptResult> {
  const prompt = createMenuPrompt();
  try {
    return await prompt.show(options);
  } finally {
    prompt.cleanup();
  }
}

