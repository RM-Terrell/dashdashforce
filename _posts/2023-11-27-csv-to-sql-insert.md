---
title: "Creating SQL insert statements programmatically from CSV with Python"
excerpt: "On tonights episode of 'Reinventing the wheel' we have this useful little script I made."
coverImage: "/assets/blog/csv-sql-insert/night_trees.jpg"
date: "2023-11-27"
tags: [python, sql, co-pilot]
photo_credit: "RM Terrell"
author:
  name: RM Terrell
  picture: "/assets/blog/authors/rm-terrell-small.jpg"
openGraphImage:
  url: "/assets/blog/csv-sql-insert/night_trees.jpg"
---

On tonights episode of "Reinventing the wheel" we have this useful little script I made. The problem I was facing was that I needed to create a lot of SQL insert statements for importing data that was originally sourced from a CSV file for testing out a new feature in a test database. Yes I realize many databases probably have built in ways to do this. Yes I realize there's probably libraries for this already. I still wanted to give it a go for my slightly specific syntax requirements as I suspected I might need such a script a LOT for testing. I was right. Now a days with Co Pilot riffing off ideas like this is so damn quick too that it was a pretty low effort creation that was none the less super useful. If you are looking for a mega optimized, production ready version of this task I would honestly look elsewhere but this was made a solid dev tool. Man I love dev tools.

## The requirements

To make the needs of the script more specific, I had data like this in CSV

```csv
name,count,creation-date,url
test name,2,20231102,not-a-real-url
another test name,3,20231101,,
```

Note the last value of the last row being empty. Many many rows of this with potential null values and mixed data types. What I wanted at the end was a bunch of statements like this:

```sql
INSERT INTO testing-data (ID, NAME, COUNT, CREATION_DATE, URL) VALUES (1,'test name',2,'20231102','not-a-real-url');
INSERT INTO testing-data (ID, NAME, COUNT, CREATION_DATE, URL) VALUES (2,'another test name',3,'20231101',NULL);
```

This allowed me to insert each row of the CSV on its own into the table `testing-data` with the types and table name being configurable. So a pretty simple algorithm here. For each row of CSV, capture each column handling its data type and assembling it into an `INSERT INTO` string with the names of the columns extracted and used for the first part of the `INSERT` statement plus an `ID` at the beginning. The values themselves should then be used for the `VALUES` portion of the statement including an `ID` column inserted at the beginning and incrementing with each row. Handle nulls. Add a semi colon at the end so it won't explode. Sounds a bit like an interview question.

## The solution

What I came up with was this.

```python
import csv


def csv_to_sql_insert(csv_file_path, types, table_name, insert_columns):
    """Function to create a SQL INSERT statement based on data from csv
    Parameters:
        csv_file -- a csv file path containing the data to insert
        types -- a list of types for each column in the csv file. Types can be
                    either NUMBER, VARCHAR, or DATE
        table_name -- the name of the table to insert into
    Returns:
        sql_insert -- a SQL INSERT statement printed to the console
    """
    with open(
        csv_file_path,
        "r",
    ) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",")
        first_row = next(csv_reader)
        num_cols = len(first_row)
        csv_file.seek(0)
        csv_reader = csv.reader(csv_file, delimiter=",")

        for idx, row in enumerate(csv_reader):
            # skip the first header row
            if idx == 0:
                continue
            formatted_columns = ", ".join(insert_columns)
            sql_insert = f"INSERT INTO {table_name} ({formatted_columns}) VALUES "
            sql_insert += "("
            # add an id to the data rows
            sql_insert += f"{idx},"
            quote_pattern = "'"
            for i in range(num_cols):
                value_to_add = ""
                if row[i] == "":
                    value_to_add = "NULL"
                elif types[i] == "NUMBER":
                    row_number = row[i]
                    row_number = str(row_number).replace("$", "")
                    row_number = row_number.replace(" ", "")
                    row_number = row_number.replace(",", "")
                    value_to_add = row_number
                elif types[i] == "VARCHAR":
                    value_to_add = quote_pattern + row[i] + quote_pattern
                elif types[i] == "DATE":
                    value_to_add = quote_pattern + row[i] + quote_pattern
                if i == num_cols - 1:
                    sql_insert += value_to_add
                else:
                    sql_insert += value_to_add + ","

            sql_insert += ");"
            print(sql_insert)


if __name__ == "__main__":
    path = "sample_data.csv"
    query_types = [
        "VARCHAR",
        "NUMBER",
        "DATE",
        "VARCHAR"
    ]
    column_names = [
        "ID",
        "NAME",
        "COUNT",
        "CREATION_DATE",
        "URL",
    ]
    query_table_name = "testing-data"

    csv_to_sql_insert(path, query_types, query_table_name, column_names)
```

Where the CSV data lives right next to the script in a file called `sample_data.csv`, and with the types, table name, and column names hard coded into the `main` block of the script. That could just as easily be factored out into params for the script itself and honestly probably should especially if this script were to sit under automation of some kind.

From there things are pretty straight forward. Using Pythons excellent `with` syntax the file is opened at the beginning (`seek(0)`) and it begins building the SQL statement inside as part of the `sql_insert` variable. One tricky bit here was handling quotes. The `quote_pattern` variable handles whether to use double or single quotes, SQL being kind of a funny beast and accepting different syntaxes in different systems. In my case I wanted single quotes. From there I handle the empty value case and convert it to `NULL`, along with cases for the 4 different data types that I am using as part of the `query_types` param.

## Further musings on AI

Co Pilot proved really useful for this script as I already had a pretty good idea of what I wanted. Co Pilot I find generally works best given very good specific, narrow directions. Not just "make me a script that does X" although it can occasionally handle that. In this case it was great for smashing out syntax like string replaces, and even inferring the next `if` case I needed to handle. Like Intellisense on steroids. I have a feeling the docstring I added at the beginning helped fuel the model too to know what I wanted to achieve and with what values though I'm not going to dig too deep into that lest I create some kind of Doc String Cargo Cult for AI.

I swear SQL and Python will be with us forever. Such useful tools.
