
Basic Functions

1. SUM: =SUM(range)
Adds up all the values in a range.


2. AVERAGE: =AVERAGE(range)
Calculates the mean of a range of values.


3. COUNT: =COUNT(range)
Counts the number of numerical values in a range.


4. COUNTA: =COUNTA(range)
Counts all non-empty cells in a range.


5. IF: =IF(condition, value_if_true, value_if_false)
Checks if a condition is met, returns specified values accordingly.


6. IFERROR: =IFERROR(value, value_if_error)
Handles errors by returning a specified value when an error is encountered.



Lookup & Reference Functions

1. VLOOKUP: =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
Looks up a value vertically in a table.


2. HLOOKUP: =HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])
Looks up a value horizontally in a table.


3. INDEX: =INDEX(array, row_num, [column_num])
Returns a value from a specific position in a range.


4. MATCH: =MATCH(lookup_value, lookup_array, [match_type])
Returns the position of a value in a range.


5. XLOOKUP: =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
A more powerful lookup function that works both horizontally and vertically.



Data Cleaning & Transformation

1. TRIM: =TRIM(text)
Removes all extra spaces from a string, except single spaces between words.


2. TEXT: =TEXT(value, format_text)
Formats a number as text in a specific format (e.g., dates, numbers).


3. CONCATENATE: =CONCATENATE(text1, text2, ...)
Joins multiple strings into one.


4. LEFT, RIGHT, MID:

=LEFT(text, num_chars): Extracts the leftmost characters from a string.

=RIGHT(text, num_chars): Extracts the rightmost characters.

=MID(text, start_num, num_chars): Extracts characters from the middle.



5. SUBSTITUTE: =SUBSTITUTE(text, old_text, new_text)
Replaces existing text with new text within a string.



Date & Time Functions

1. TODAY: =TODAY()
Returns the current date.


2. NOW: =NOW()
Returns the current date and time.


3. DATE: =DATE(year, month, day)
Creates a date from separate year, month, and day inputs.


4. DATEDIF: =DATEDIF(start_date, end_date, unit)
Calculates the difference between two dates in years, months, or days.



Statistical Functions

1. MEDIAN: =MEDIAN(range)
Returns the median of a range.


2. MODE: =MODE(range)
Returns the most frequent value in a range.


3. STDEV: =STDEV(range)
Calculates the standard deviation of a range of values.


4. RANK: =RANK(number, ref, [order])
Ranks a number in a list of numbers.



Logical Functions

1. AND: =AND(logical1, logical2, ...)
Returns TRUE if all conditions are TRUE.


2. OR: =OR(logical1, logical2, ...)
Returns TRUE if at least one condition is TRUE.


3. NOT: =NOT(logical)
Reverses the logical value (TRUE to FALSE, or FALSE to TRUE).



Data Analysis

1. Pivot Tables:
Create summaries from large datasets by using Insert > PivotTable. It allows you to aggregate, filter, and analyze data quickly.


2. Conditional Formatting:
Use Home > Conditional Formatting to highlight cells based on rules or conditions (e.g., color cells above a certain threshold).


3. Data Validation:
Restrict input values using Data > Data Validation to enforce criteria on user input.


4. Text to Columns:
Split data into different columns using Data > Text to Columns.



Automation with VBA

1. Macro Recording:
Record repetitive tasks using Developer > Record Macro.


2. Basic VBA Functions:

Range("A1").Value = 10: Sets the value of cell A1 to 10.

For Each cell in Range("A1:A10"): Loops through a range of cells.




Charts and Visualization

1. Charts:
Create basic visualizations like bar charts, line graphs, and scatter plots using Insert > Charts.


2. Slicers:
Use Insert > Slicer to add interactive filters to PivotTables or PivotCharts.


3. Sparklines:
Insert mini-charts inside cells with Insert > Sparklines.



Shortcuts

1. Ctrl + Shift + L: Toggle filters on/off.


2. Ctrl + T: Convert a range of data into a table.


3. Ctrl + Shift + Enter: Enter an array formula.


4. Alt + =: Automatically sum selected cells.


5. Ctrl + `: Toggle between displaying formulas and results.



This cheat sheet covers the essentials for data scientists to efficiently manipulate and analyze data in Excel.

