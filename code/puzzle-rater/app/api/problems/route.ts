import { NextResponse } from 'next/server';
import { read, utils } from 'xlsx';
import path from 'path';
import fs from 'fs';

const EXCEL_PATH = '/Users/ramachandran/Documents/Self/Code/MacGyver/data/MacGyver/problem_solution_pair.xlsx';

export async function GET() {
  try {
    console.log('Attempting to read file from:', EXCEL_PATH);
    const buffer = fs.readFileSync(EXCEL_PATH);
    console.log('File read successfully, creating workbook');
    const workbook = read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(sheet);
    
    const problems = data.map((row: any, index) => ({
      id: index + 1,
      problem: row.Problem || '',
    }));

    return NextResponse.json({ problems });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    console.error('Attempted path:', EXCEL_PATH);
    return NextResponse.json({ error: 'Failed to read problems' }, { status: 500 });
  }
}
