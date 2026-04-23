from flask import Flask, request, render_template_string

app = Flask(__name__)

contents = []

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        contents.append({'title': title, 'description': description})

    html = """
    <h2>Simple Content Management System</h2>
    <form method="POST">
        Title: <input type="text" name="title"><br><br>
        Description: <input type="text" name="description"><br><br>
        <button type="submit">Add Content</button>
    </form>
    <hr>
    <h3>Stored Contents:</h3>
    {% for item in contents %}
        <p><b>{{item.title}}</b>: {{item.description}}</p>
    {% endfor %}
    """
    return render_template_string(html, contents=contents)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)