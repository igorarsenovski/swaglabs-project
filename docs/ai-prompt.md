# AI Prompts Used

1. Login basic
   Generate a Playwright test in TypeScript that logs in to https://www.saucedemo.com with username 'standard_user' and password 'secret_sauce', then asserts redirect to /inventory.html. Use Playwright Test syntax.

2. Login matrix
   Generate a TS Playwright test that logs in with multiple users (standard_user, problem_user) and verifies redirect to /inventory.html using a loop.

3. Checkout missing fields
   Write a Playwright TypeScript test for https://www.saucedemo.com that tries to check out with missing fields: (1) missing last name, (2) missing postal code. Log in as 'standard_user'/'secret_sauce', add one item, open cart, go to checkout, fill the form with the specified missing field, click Continue, and assert the correct error message appears.

4. Logout
   Create a Playwright TS test for https://www.saucedemo.com that logs in as 'standard_user'/'secret_sauce', opens the burger menu (id react-burger-menu-btn), clicks the Logout link (id logout_sidebar_link), and verifies the URL returns to the login page.

While AI suggested logout would clear the cart, in practice the application persists cart state. I added a separate manual test for Reset App State to cover true clearing behavior.

5. Sorting high→low
   Write a Playwright test in TypeScript that logs in to https://www.saucedemo.com with 'standard_user'/'secret_sauce', sets the product sort to 'Price (high to low)' using select [data-test="product-sort-container"], and verifies prices are in descending order.

> Each generated snippet was reviewed and adapted to fit the project's POM and selector hygiene.
