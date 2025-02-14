import { NextResponse } from 'next/server';
import { read, utils, write } from 'xlsx';
import path from 'path';
import fs from 'fs';

const EXCEL_PATH = '/Users/ramachandran/Documents/Self/Code/MacGyver/data/MacGyver/problem_solution_pair.xlsx';

export async function POST(request: Request) {
  try {
    const { problemId, isInteresting } = await request.json();

    console.log('Attempting to read file from:', EXCEL_PATH);
    const buffer = fs.readFileSync(EXCEL_PATH);
    console.log('File read successfully, creating workbook');
    const workbook = read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(sheet);

    if (problemId > 0 && problemId <= data.length) {
      const rowIndex = problemId - 1;
      (data[rowIndex] as any).IsInteresting = isInteresting;

      const newSheet = utils.json_to_sheet(data);
      workbook.Sheets[workbook.SheetNames[0]] = newSheet;
      const wbout = write(workbook, { bookType: 'xlsx', type: 'buffer' });
      fs.writeFileSync(EXCEL_PATH, wbout);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid problem ID' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json(
      { error: 'Failed to save response' },
      { status: 500 }
    );
  }
}
