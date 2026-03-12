![[Untitled.base]]
There are mainly two ways to extract data from a website

1. Use the API of the website (if it exists). 
	 - Eg. Facebook has the Facebook Graph API which allows retrieval of data posted on Facebook.
2. Access the HTML of the webpage and extract useful information/data from it. 

This technique is called web scraping or web harvesting or web data extraction.

Steps involved in web scraping: Beautiful Soup

1. Send an HTTP request to the URL of the webpage you want to access. 
2. The server responds to the request by returning the HTML content of the webpage. 
	- For this task, we will use a third-party HTTP library for python-requests.
3. Once we have accessed the HTML content, we are left with the task of parsing the data.
	- Since most of the HTML data is nested, we cannot extract data simply through string processing. 
	- One needs a parser which can create a nested/tree structure of the HTML data. 
	- There are many HTML parser libraries available but the most advanced one is [[html5lib]].
4. Now, all we need to do is navigating and searching the parse tree that we created, i.e. tree traversal. 
5. For this task, we will be using another third-party python library, Beautiful Soup. 
	- It is a Python library for pulling data out of HTML and XML files.


Let us try to understand this piece of code.

- First of all import the requests library.
- Then, specify the URL of the webpage you want to scrape.
- Send a HTTP request to the specified URL and save the response from server in a response object called r.
- Now, as print r.content to get the raw HTML content of the webpage. 
- It is of ‘string’ type.

**Step 1: Installing the required third-party libraries**

```python
pip install requests
pip install html5lib
pip install bs4
```

**Step 2: Accessing the HTML content from webpage** 



**Step 3: Parsing the HTML content** 

BeautifulSoup library is that it is built on the top of the HTML parsing libraries like html5lib, lxml, html.parser, etc. 

BeautifulSoup object and specify the parser library can be created at the same time. 

```python
soup = BeautifulSoup(r.content, 'html5lib')
```

We create a BeautifulSoup object by passing two arguments:

**r.content** : It is the raw HTML content.
**html5lib** : Specifying the HTML parser we want to use.

Now **soup.prettify()** is printed, it gives the visual representation of the parse tree created from the raw HTML content. 

**Step 4: Searching and navigating through the parse tree** 

Now, we would like to extract some useful data from the HTML content. The soup object contains all the data in the nested structure which could be programmatically extracted. 

In our example, we are scraping a webpage consisting of some quotes. So, we would like to create a program to save those quotes (and all relevant information about them). 

Before moving on, we recommend you to go through the HTML content of the webpage which we printed using soup.prettify() method and try to find a pattern or a way to navigate to the quotes.

- It is noticed that all the quotes are inside a **div container** whose id is ‘**all_quotes**’. 

So, we find that div element using **find()** method :

```python
table = soup.find('div', attrs = {'id':'all_quotes'}) 
```

The first argument is the HTML tag you want to search  

Second argument is a dictionary type element to specify the additional attributes associated with that tag. 

**find()** method returns the first matching element. 

You can try to print **table.prettify()** to get a sense of what this piece of code does.