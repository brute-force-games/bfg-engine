# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - heading "BFG CLI" [level=1] [ref=e4]
    - generic [ref=e5]:
      - generic [ref=e6] [cursor=pointer]:
        - text: Upload JSON
        - button "Upload JSON" [ref=e7]
      - button "Download JSON" [ref=e8] [cursor=pointer]
      - button "bfg --help" [ref=e9] [cursor=pointer]
  - generic [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]: BFG CLI Web Interface
      - generic [ref=e13]: Type a command and press Enter or click Execute
      - generic [ref=e14]: Opening file picker...
      - generic [ref=e15]: "File selected: test-import-1765070230960.json"
      - generic [ref=e16]: "Reading JSON file: test-import-1765070230960.json..."
      - generic [ref=e17]: "File read: 329 characters"
      - generic [ref=e18]: Importing data into TinyBase store...
      - generic [ref=e19]: Data loaded into TinyBase store
      - generic [ref=e20]: Loaded 0 profile(s) from imported JSON
      - generic [ref=e21]: Saving imported data to IndexedDB (primary storage)...
      - generic [ref=e22]: "Data saved to IndexedDB: 0 profile(s)"
      - generic [ref=e23]: Data synced to SQLite
      - generic [ref=e24]: "Final verification: 0 profile(s) in store"
      - generic [ref=e25]: ✓ JSON imported successfully from test-import-1765070230960.json
      - generic [ref=e26]: You may need to refresh the page or run "list-users" to see the imported data
      - generic [ref=e27]: bfg$ list-users
      - generic [ref=e28]: "[handleListUsers] Starting"
      - generic [ref=e29]: Fetching user profiles...
      - generic [ref=e30]: "Error validating profile data for test-profile-import: { \"name\": \"ZodError\", \"message\": \"[\\n {\\n \\\"origin\\\": \\\"string\\\",\\n \\\"code\\\": \\\"invalid_format\\\",\\n \\\"format\\\": \\\"regex\\\",\\n \\\"pattern\\\": \\\"/^bfg_player_profile_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/\\\",\\n \\\"path\\\": [\\n \\\"id\\\"\\n ],\\n \\\"message\\\": \\\"Invalid string: must match pattern /^bfg_player_profile_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/\\\"\\n },\\n {\\n \\\"expected\\\": \\\"object\\\",\\n \\\"code\\\": \\\"invalid_type\\\",\\n \\\"path\\\": [\\n \\\"webCryptoWallet\\\",\\n \\\"signingKeyPair\\\"\\n ],\\n \\\"message\\\": \\\"Invalid input: expected object, received undefined\\\"\\n },\\n {\\n \\\"expected\\\": \\\"object\\\",\\n \\\"code\\\": \\\"invalid_type\\\",\\n \\\"path\\\": [\\n \\\"webCryptoWallet\\\",\\n \\\"encryptionKeyPair\\\"\\n ],\\n \\\"message\\\": \\\"Invalid input: expected object, received undefined\\\"\\n }\\n]\" }"
      - generic [ref=e31]: "⚠️ Warning: Found 1 profile(s) in store but none passed validation."
      - generic [ref=e32]: This may indicate data format issues. Try creating a new user with "bfg add-user <handle>".
    - generic [ref=e33]:
      - generic [ref=e34]: $
      - textbox "Enter command (e.g., list-users, add-user <handle>)" [ref=e35]
      - button "Execute" [active] [ref=e36] [cursor=pointer]
```