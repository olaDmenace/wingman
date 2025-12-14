/**
 * Code Generation Command
 * Auto-generates boilerplate code
 */

import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

interface GenerateOptions {
  name?: string;
}

export async function generateCodeCommand(type: string, options: GenerateOptions) {
  console.log(chalk.blue.bold('\n🏗️  Code Generator\n'));

  if (!options.name) {
    console.log(chalk.red('❌ Error: Name is required'));
    console.log(chalk.yellow(`Usage: wingman generate ${type} --name my-${type}`));
    process.exit(1);
  }

  try {
    switch (type) {
      case 'api-route':
        await generateApiRoute(options.name);
        break;
      case 'component':
        await generateComponent(options.name);
        break;
      case 'email-template':
        await generateEmailTemplate(options.name);
        break;
      default:
        console.log(chalk.red(`❌ Unknown type: ${type}`));
        console.log(chalk.yellow('Available types: api-route, component, email-template'));
        process.exit(1);
    }

    console.log(chalk.green.bold(`\n✅ Generated ${type}: ${options.name}\n`));
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}

async function generateApiRoute(name: string) {
  const routePath = path.join(process.cwd(), 'src', 'app', 'api', name, 'route.ts');
  const dir = path.dirname(routePath);

  await fs.mkdir(dir, { recursive: true });

  const content = `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement GET logic
    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Error in ${name}:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Implement POST logic
    return NextResponse.json({ message: 'Success', data: body });
  } catch (error) {
    console.error('Error in ${name}:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
`;

  await fs.writeFile(routePath, content, 'utf-8');
  console.log(chalk.cyan(`Created: ${routePath}`));
}

async function generateComponent(name: string) {
  const componentPath = path.join(process.cwd(), 'src', 'components', `${name}.tsx`);
  const dir = path.dirname(componentPath);

  await fs.mkdir(dir, { recursive: true });

  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);

  const content = `interface ${pascalName}Props {
  // TODO: Define props
}

export default function ${pascalName}({}: ${pascalName}Props) {
  return (
    <div>
      {/* TODO: Implement component */}
      <h1>${pascalName}</h1>
    </div>
  );
}
`;

  await fs.writeFile(componentPath, content, 'utf-8');
  console.log(chalk.cyan(`Created: ${componentPath}`));
}

async function generateEmailTemplate(name: string) {
  console.log(chalk.yellow('Email template generation not yet implemented'));
}
