# Practical 1

## STEP 1: Install Prerequisites

Make sure you have:

- Python (3.10+)
- Docker installed

Check:

```bash
python --version
docker --version
```

If Docker is not installed → install Docker Desktop.

---

## ✅ STEP 2: Create Project Folder

```bash
mkdir event-registration
cd event-registration
```

## ✅ STEP 3: Create Project Structure

Create files:

```bash
touch app.py requirements.txt Dockerfile
mkdir templates
touch templates/index.html
```

Final structure:

```
event-registration/
│── app.py
│── requirements.txt
│── Dockerfile
│── templates/
│     └── index.html
```

## ✅ STEP 4: Write Flask Code (app.py)

```python
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        return f"Registration Successful! Name: {name}, Email: {email}"
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## ✅ STEP 5: Create HTML Form

📄 `templates/index.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Event Registration</title>
</head>
<body>
    <h1>Event Registration Form</h1>

    <form method="POST">
        Name: <input type="text" name="name" required><br><br>
        Email: <input type="email" name="email" required><br><br>
        <button type="submit">Register</button>
    </form>

</body>
</html>
```

## ✅ STEP 6: Add Requirements File

📄 `requirements.txt`

```
Flask==2.3.2
```

## ✅ STEP 7: Create Dockerfile

📄 `Dockerfile`

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

## ✅ STEP 8: Build Docker Image

Run inside project folder:

```bash
docker build -t event-registration-app .
```

## ✅ STEP 9: Run Docker Container

```bash
docker run -p 5000:5000 event-registration-app
```

## ✅ STEP 10: Open in Browser

Go to:

```
http://localhost:5000
```

You will see the registration form.

## ✅ STEP 11: Test Application

- Enter name & email
- Click submit
- You should see:
  ```
  Registration Successful! Name: ..., Email: ...
  ```

## ✅ STEP 12: Verify Docker

Check running container:

```bash
docker ps
```

Stop container:

```bash
docker stop <container_id>
```

---

# Practical 5

## Step 1: Create Project Folder

```bash
mkdir content-management-app
cd content-management-app
```

## ✅ Step 2: Create Flask App (app.py)

```python
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
```

## ✅ Step 3: Create requirements.txt

```
Flask==2.3.2
```

## ✅ Step 4: Create Dockerfile

> ⚠️ Your image had a mistake (Flask==2.3.2FROM). Use this corrected version:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

## ✅ Step 5: Build Docker Image

```bash
docker build -t content-management-app .
```

## ✅ Step 6: Check Images

```bash
docker images
```

## ✅ Step 7: Run Container

```bash
docker run -d -p 5000:5000 --name cms-container content-management-app
```

Remove Old Container and Run Fresh:

```bash
docker stop cms-container
docker rm cms-container
docker run -d -p 5000:5000 --name cms-container content-management-app
```

## ✅ Step 8: Open in Browser

```
http://localhost:5000
```

You should see:

- Form to add content
- Display of submitted content

## ✅ Step 9: Docker Commands (For Viva + Practical)

🔹 List running containers:
```bash
docker ps
```

🔹 Stop container:
```bash
docker stop cms-container
```

🔹 Start container:
```bash
docker start cms-container
```

🔹 Remove container:
```bash
docker rm cms-container
```

🔹 Remove image:
```bash
docker rmi content-management-app
```

🔹 Execute inside container:
```bash
docker exec -it cms-container /bin/bash
```

## ✅ Step 10: Volume Mapping (Important for Marks)

```bash
docker run -d -p 5000:5000 -v ${PWD}:/app --name cms-container content-management-app
```

👉 This ensures:

- Data persists even if container is deleted

---

# Practical 6

## First Important Thing (Most Students Get Stuck Here)

You CANNOT run Kubernetes without enabling it first.

👉 Choose ONE option:

### Option A (Easiest for Windows) ✅

Use Docker Desktop Kubernetes:

1. Open Docker Desktop
2. Go to Settings → Kubernetes
3. Enable ✔ Kubernetes
4. Click Apply & Restart

## Step 1: Build Docker Image

Inside your project folder:

```bash
docker build -t flask-k8s-app .
```

## ✅ Step 2: Push Image to Docker Hub

🔹 Login:
```bash
docker login
```

🔹 Tag image (replace with your username):
```bash
docker tag flask-k8s-app sainimbalkar/flask-k8s-app
```

🔹 Push:
```bash
docker push sainimbalkar/flask-k8s-app
```

> ⚠️ Important: In Kubernetes, local images sometimes don't work. So pushing to Docker Hub is necessary.

## ✅ Step 3: Start Kubernetes

```bash
kubectl get nodes
```

✔ Expected output:

```
NAME             STATUS   ROLES
docker-desktop   Ready    control-plane
```

## ✅ Step 4: Create Deployment File

Create file: `deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flask-app
  template:
    metadata:
      labels:
        app: flask-app
    spec:
      containers:
      - name: flask-container
        image: sainimbalkar/flask-k8s-app
        ports:
        - containerPort: 5000
```

## ✅ Step 5: Apply Deployment

```bash
kubectl apply -f deployment.yaml
```

## ✅ Step 6: Check Pods

```bash
kubectl get pods
```

✔ You should see:

```
flask-deployment-xxxxx   Running
flask-deployment-yyyyy   Running
```

## ✅ Step 7: Create Service File

Create file: `service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: flask-service
spec:
  type: NodePort
  selector:
    app: flask-app
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
      nodePort: 30007
```

## ✅ Step 8: Apply Service

```bash
kubectl apply -f service.yaml
```

## ✅ Step 9: Access Application

🔹 If using Docker Desktop Kubernetes:
```
http://localhost:30007
```

---

## Fix Properly (Very Important Step)

### ✅ Step 1: Delete Old Deployment

```bash
kubectl delete -f deployment.yaml
```

### ✅ Step 2: Reapply Deployment

```bash
kubectl apply -f deployment.yaml
```

### ✅ Step 3: Check Pods

```bash
kubectl get pods
```

👉 Now you should see:

```
STATUS: Running
```

So final config:

```yaml
containers:
- name: flask-container
  image: sainimbalkar/flask-k8s-app
  imagePullPolicy: Always
  ports:
  - containerPort: 5000
```

Apply again:

```bash
kubectl apply -f deployment.yaml
```

### 🚨 Step 4: Verify Service

```bash
kubectl get svc
```

Make sure:

- NodePort → 30007

## Step 2: Check Logs (CONFIRM APP STARTED)

Run:

```bash
kubectl logs flask-deployment-655bf8c6c-22z4n
```

You should see something like:

```
Running on http://0.0.0.0:5000/
```

## 🔹 Step 3: Port Forward Test (VERY POWERFUL DEBUG)

Run:

```bash
kubectl port-forward deployment/flask-deployment 5000:5000
```

Then open:

```
http://localhost:5000
```

## Step 4: Test Service Internally

Run:

```bash
kubectl get svc
```

You already have:

```
5000:30007
```

## 🔥 Step 5: Try This (Important)

Sometimes NodePort doesn't bind properly on Docker Desktop.

Run:

```bash
kubectl port-forward service/flask-service 8080:5000
```

Then open:

```
http://localhost:8080
```

---

# Practical 7

## What You Already Have

- Docker image: `sainimbalkar/flask-k8s-app` ✅
- Kubernetes working ✅
- App running via port-forward ✅

👉 Now we focus on automation features:

- Self-healing
- Auto scaling
- Rolling updates

## ✅ Step 1: Create Deployment (deployment.yaml)

Create a new file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flask-auto-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flask-auto-app
  template:
    metadata:
      labels:
        app: flask-auto-app
    spec:
      containers:
      - name: flask-container
        image: sainimbalkar/flask-k8s-app
        imagePullPolicy: Always
        ports:
        - containerPort: 5000
```

## ✅ Step 2: Apply Deployment

```bash
kubectl apply -f deployment.yaml
```

## ✅ Step 3: Verify Pods

```bash
kubectl get pods
```

## ✅ Step 4: Create Service (service.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: flask-auto-service
spec:
  type: NodePort
  selector:
    app: flask-auto-app
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
      nodePort: 30008
```

## ✅ Step 5: Apply Service

```bash
kubectl apply -f service.yaml
```

## ✅ Step 6: Access App (Use Port Forward – Reliable)

```bash
kubectl port-forward service/flask-auto-service 8081:5000
```

Open:

```
http://localhost:8081
```

---

## 🚀 AUTOMATION FEATURES (Main Part)

### 🔥 1. Self-Healing Test

Delete a pod manually:

```bash
kubectl get pods
kubectl delete pod <pod-name>
```

👉 Then run:

```bash
kubectl get pods
```

✔ You will see:

- Old pod deleted
- New pod automatically created

👉 This is **Self-Healing**

### 🔥 2. Auto Scaling (HPA)

Enable metrics server (if not already):

```bash
kubectl top pods
```

> If error → tell me (I'll fix it)

Create HPA:

```bash
kubectl autoscale deployment flask-auto-deployment --cpu-percent=50 --min=2 --max=5
```

Check:

```bash
kubectl get hpa
```

### 🔥 3. Rolling Update

**Step 1:** Create New Version Image:

```bash
docker build -t sainimbalkar/flask-k8s-app:v2 .
docker push sainimbalkar/flask-k8s-app:v2
```

**Step 2:** Update Deployment:

```bash
kubectl set image deployment/flask-auto-deployment flask-container=sainimbalkar/flask-k8s-app:v2
```

**Step 3:** Watch Update:

```bash
kubectl rollout status deployment flask-auto-deployment
```

👉 Pods will update one by one (zero downtime)

### 🔥 4. Verify Automation

```bash
kubectl get pods
kubectl get deployments
kubectl get hpa
```


---

# Practical 8

## Step 1: Prerequisites (VERY IMPORTANT)

Make sure these are installed:

- Docker -> `docker --version`
- Node.js -> `node -v`
- npm -> `npm -v`
- Google Chrome installed

Also install ChromeDriver (important for Selenium):

- Download from: https://chromedriver.chromium.org/downloads
- Match Chrome version
- Add it to system PATH

## Step 2: Run Your Containerized App

Open terminal in your project folder:

```bash
docker build -t content-management-app .
docker run -d -p 5000:5000 content-management-app
```

Check if running:

```bash
docker ps
```

Now open in browser:

```
http://localhost:5000
```

If this doesn't open -> STOP and fix first.

## Step 3: Setup Selenium Project

Create a new folder (or inside project):

```bash
mkdir selenium-test
cd selenium-test
```

Initialize Node project:

```bash
npm init -y
```

Install Selenium:

```bash
npm install selenium-webdriver
```

(Optional but recommended)

```bash
npm install chromedriver
```

## Step 4: Create Test Script

Create file: `test_cms.js`

Paste this FULL WORKING CODE:

```js
const { Builder, By, until } = require('selenium-webdriver');

async function testCMS() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5000');

        // Wait for Title input
        await driver.wait(until.elementLocated(By.name('title')), 5000);

        // TC1: Enter Title
        let titleInput = await driver.findElement(By.name('title'));
        await titleInput.sendKeys("Test Title");

        // TC2: Enter Description
        let descInput = await driver.findElement(By.name('description'));
        await descInput.sendKeys("Test Description");

        // TC3: Click Add Content button
        let button = await driver.findElement(By.xpath("//button[text()='Add Content']"));
        await button.click();

        // Wait for content to appear
        await driver.sleep(2000);

        console.log("Content added successfully");

        // TC4: Add multiple entries
        for (let i = 1; i <= 2; i++) {

    await driver.wait(until.elementLocated(By.name('title')), 5000);

    let titleInput = await driver.findElement(By.name('title'));
    await titleInput.clear();
    await titleInput.sendKeys("Title " + i);

    let descInput = await driver.findElement(By.name('description'));
    await descInput.clear();
    await descInput.sendKeys("Desc " + i);

    let button = await driver.findElement(By.xpath("//button[text()='Add Content']"));
    await button.click();

    await driver.sleep(1000);
}

        console.log("Multiple entries added");

        // TC5: Refresh
        await driver.navigate().refresh();
        console.log("Page refreshed");

    } catch (err) {
        console.error("Test Failed:", err);
    } finally {
        await driver.quit();
    }
}

testCMS();

testCMS();
```

## Step 5: Run the Test

```bash
node test_cms.js
```

## Step 6: Expected Output

You should see:

- Chrome browser opens automatically
- It:
  - Loads page
  - Adds content
  - Checks empty validation
  - Adds multiple entries
  - Refreshes page

Terminal output:

```
Page Title: ...
Content added successfully
Empty validation checked
Multiple entries added
Page refreshed successfully
```

---

# Practical 9

## Step 1: Create Project Folder

```bash
mkdir js-selenium-test
cd js-selenium-test
```

## Step 2: Create Simple JavaScript Web App

Create file: `index.html`

Paste this working addition program:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Addition App</title>
</head>
<body>

<h2>Addition Calculator</h2>

<input type="number" id="num1" placeholder="Enter first number">
<input type="number" id="num2" placeholder="Enter second number">

<button onclick="addNumbers()">Add</button>

<h3 id="result"></h3>

<script>
function addNumbers() {
    let a = parseInt(document.getElementById("num1").value);
    let b = parseInt(document.getElementById("num2").value);
    let sum = a + b;
    document.getElementById("result").innerText = "Result: " + sum;
}
</script>

</body>
</html>
```

## Step 3: Test Manually (IMPORTANT)

Open file in browser:

Right click -> Open with Chrome

Test:

- Enter 5 and 3
- Click Add
- Output should be:

```
Result: 8
```

If this fails -> fix before Selenium.

## Step 4: Setup Selenium

Initialize Node project:

```bash
npm init -y
```

Install Selenium:

```bash
npm install selenium-webdriver
npm install chromedriver
```

## Step 5: Create Selenium Test Script

Create file: `test.js`

> Replace path correctly (VERY IMPORTANT)

Get full path of your HTML file:

Example:

```
C:\Users\hp\Downloads\js-selenium-test\index.html
```

Convert to:

```
file:///C:/Users/hp/Downloads/js-selenium-test/index.html
```

Paste this code:

```js
const { Builder, By, until } = require('selenium-webdriver');

async function testAddition() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Correct local file path (use forward slashes)
        const filePath = 'file:///C:/Users/hp/Downloads/content-management-app/Pr%205,6,7/selenium-test/js-selenium-test/index.html';

        await driver.get(filePath);
        console.log("Page opened");

        // Wait for elements to load
        await driver.wait(until.elementLocated(By.id('num1')), 5000);

        let num1 = await driver.findElement(By.id('num1'));
        let num2 = await driver.findElement(By.id('num2'));

        // Enter values
        await num1.sendKeys('5');
        await num2.sendKeys('3');

        // Click button
        await driver.findElement(By.tagName('button')).click();

        await driver.sleep(1000);

        // Get result
        let resultText = await driver.findElement(By.id('result')).getText();
        console.log("Result:", resultText);

        // Validate result
        if (resultText.includes('8')) {
            console.log("Test Passed");
        } else {
            console.log("Test Failed");
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await driver.quit();
    }
}

testAddition();

testAddition();
```

## Step 6: Run Test

```bash
node test.js
```

## Expected Output

Browser will:

- Open automatically
- Enter values
- Click button
- Show result

Terminal:

```
Page opened
Result: Result: 8
Test Passed
```
