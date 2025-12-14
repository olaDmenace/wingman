# Contributing to Wingman Travel

First off, thank you for considering contributing to Wingman Travel! It's people like you that make Wingman Travel such a great tool for travelers.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this code.

### Our Standards

Examples of behavior that contributes to a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior:
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows, macOS, Linux]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

### Pull Requests

**Process:**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/wingman.git
   cd wingman
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clear, concise commit messages
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Run development server
   npm run dev

   # Run production build
   npm run build

   # Check types
   npm run type-check

   # Lint code
   npm run lint
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **Commit Message Convention:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template
   - Submit!

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## Development Setup

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher
- Git

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/wingman.git
   cd wingman
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your API keys (see README.md for details)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` unless absolutely necessary
- Use `const` for immutable values, `let` for mutable ones

### React/Next.js
- Use functional components with hooks
- Keep components small and focused
- Use proper TypeScript types for props
- Follow Next.js App Router conventions

### File Naming
- Components: PascalCase (e.g., `FlightCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `FlightTypes.ts`)
- API routes: lowercase with hyphens (e.g., `check-alerts/route.ts`)

### Comments
- Write self-documenting code when possible
- Add comments for complex logic
- Use JSDoc for functions and classes
- Keep comments up-to-date

### Example Code Style
```typescript
/**
 * Searches for flights between two airports
 * @param origin - Origin airport code (IATA)
 * @param destination - Destination airport code (IATA)
 * @param date - Departure date in ISO format
 * @returns Promise resolving to array of flights
 */
export async function searchFlights(
  origin: string,
  destination: string,
  date: string
): Promise<Flight[]> {
  // Validate inputs
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  // Fetch flights from API
  const response = await fetch(`/api/flights?from=${origin}&to=${destination}&date=${date}`);

  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }

  return response.json();
}
```

## Project Structure

```
wingman/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── page.tsx      # Homepage
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   │   ├── ai.ts         # OpenAI integration
│   │   ├── flight-api.ts # Amadeus API client
│   │   ├── email-supabase.ts # Email service
│   │   └── supabase.ts   # Supabase client
│   └── types/            # TypeScript type definitions
├── supabase/
│   └── functions/        # Supabase Edge Functions
├── public/               # Static assets
└── scripts/              # Build and utility scripts
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write tests for new features
- Update tests when modifying existing code
- Aim for high code coverage
- Test edge cases and error conditions

## Documentation

### Updating Documentation
- Update README.md for user-facing changes
- Update inline code comments
- Add JSDoc comments for new functions
- Update API documentation for new endpoints

### Documentation Standards
- Use clear, concise language
- Include code examples
- Keep documentation up-to-date with code changes
- Use proper markdown formatting

## Community

### Getting Help
- **GitHub Issues**: For bug reports and feature requests
- **Email**: oladmenace@gmail.com for private inquiries

### Recognition
Contributors will be recognized in:
- README.md acknowledgments section
- Release notes
- Project credits

## License

By contributing to Wingman Travel, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask questions! We're here to help:
- Open an issue with the `question` label
- Email us at oladmenace@gmail.com

Thank you for contributing to Wingman Travel! ✈️
