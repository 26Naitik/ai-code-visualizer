export async function explainCode(code) {

  if (typeof code !== "string") {

    return ""
  }

  await new Promise((resolve) =>
    setTimeout(resolve, 400)
  )

  return `
✅ Code Explanation

This function prints "Hello World" in the console.

📌 Line-by-line Explanation:

1. function hello()
   → Creates a function named hello.

2. console.log("Hello World")
   → Prints Hello World in browser console.

📊 Time Complexity:
O(1)

📦 Space Complexity:
O(1)

⚠️ Common Mistakes:
- Forgetting parentheses ()
- Missing semicolon
- Wrong spelling of console.log
`
}