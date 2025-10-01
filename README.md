<h1 align="center">Precision Auto Repair and Body</h1>

<p align="center">

<img src="images/logoBW.png" alt="Precision-Auto-Logo" />

</p>

---

This project is a full-stack web application developed for Precision Auto Repair
and Body, a full-service auto body and mechanic shop. The application
streamlines customer interactions, service requests, and administrative tasks,
enhancing operational efficiency and customer satisfaction.

---

## 📌 Table of Contents

- [Project Overview](#project-overview)
- [Team Members](#team-members)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Developer Instructions](#-developer-instructions)
  - [Prerequisites](#prerequisites)
  - [IDE Setup](#ide-setup)
  - [Frontend Setup (Next.js)](#-frontend-setup-nextjs)
  - [Backend Setup (Python)](#-backend-setup-python)
- [Testing (Planned for CSC 191)](#-testing-planned-for-csc-191)
- [Deployment Plan](#-deployment-planned-for-csc-191)
- [Photos](#erd)
- [Future Timeline – Portal Features](#future-timeline--precision-auto-repair-portal-features)

---

### Team Members

- Daryl Hammerburg – [dhammerburg@csus.edu](mailto:dhammerburg@csus.edu)

- Emily Mejia - [emilymejia2@csus.edu  
  ](mailto:emilymejia2@csus.edu)
- Baljot Kaur – [baljotkaur@csus.edu](mailto:baljotkaur@csus.edu)

- Ezra Pisiw – [episiw@csus.edu](mailto:episiw@csus.edu)

- Michael Oleshchuk - [moleshchuk@csus.edu](mailto:moleshchuk@csus.edu)

- Phillip Lyasota - [plyasota@csus.edu](mailto:plyasota@csus.edu)

- Tobey Ligaya - [tobeyligaya2@csus.edu](mailto:tobeyligaya2@csus.edu)

- Igor Romantsov - [iromantsov@csus.edu](mailto:iromantsov@csus.edu)

---

### Project Overview

Users:

- Log in and create accounts

- Request online estimates with image uploads

- Schedule Appointments

- Track vehicle repair status

- Leave reviews and participate in a loyalty program

Admin:

- Manage service portfolios and customer reviews

- Review server requests and track vehicle status

- Send automated appointment reminders via email/sms

- Manage shop information, photos, and records

### Key-features

- Secure client & admin Login (Manual + Gmail Auth)

- Estimate Request Form with image upload support

- Vehicle Repair Tracking & History

- Loyalty Program Page with pricing and benefits

- About page with business info, photos, and location

---

### Getting Started

To run this example, simply do:

```

1. Open a Command Prompt in the ‘precision-auto’ folder

2. Input ‘npm install’

3. Wait for it to finish. If successful, then input ‘npm run dev’

4. After starting, open a browser and go to address ‘http://localhost:3000/’

```

Then you will see a simple web app with a page like this:

<img src="images/landingPage.png" alt="Precision-Auto-Landing" />

---

## 👨‍💻 Developer Instructions

#### Prerequisites

- Node.js 20+

- Python 3.11+

- PostgreSQL

- Git

### IDE setup

VSCode is highly preferred. Please ensure you have installed these extensions:

- Prettier
- stylelint
- eslint

#### 🧱 Frontend Setup (Next.js)

```bash

git clone https://github.com/your-team/precision-auto.git

cd precision-auto

npm install

npm install next react react-dom

npm run dev

```

#### 🐍 Backend Setup (Python)

```bash

cd ../../backend

python -m venv venv

source venv/bin/activate # Windows: venv\Scripts\activate

pip install -r requirements.txt

python app.py

```

#### AWS setup -S3 bucket

Get the AWS credentials and set up the aws config.

1. download the aws CLI: https://aws.amazon.com/cli/
2. in global terminal (base) type `aws configure --profile default`
3. fill out the propper AWS Config Access key ID should be: AKIASOH2UO7T3GKIB2FQ
4. For AWS Secret access key please refer to the discord (posted only to the a
   client after testing)
5. Go bacck to vs-code and down load the aws tool kit extention
6. Set the AWS config to be the --profile default
7. In global terminal type `aws sts get-caller-identity --profile default` to
   ensure everything is loaded. Ensure that "Arn":
   "arn:aws:iam::168029353959:user/student-dev"

### 🧪 Testing _(Planned for CSC 191)_

We will implement thorough testing in CSC 191 using:

- **Jest** for testing React components

- **Pytest** for Python backend unit tests

- **Postman** for API validation

- Cross-browser and mobile compatibility checks

### 🚀 Deployment (Planned for CSC 191)

Deployment Strategy:

- **Frontend**: Next.js (React) hosted on **Heroku**

- **Backend**: Python hosted on **Heroku**

- **Database**: PostgreSQL via Heroku’s managed database service

- CI/CD via GitHub Actions

---

### ERD

 <img src="images/ERD.png" alt="ERD Diagram" />
  
---

<h2 align="center">LANDING PAGE</h2>
<img src="images/landingPage.png" alt="Precision-Auto-Landing" />

<h2 align="center">CREATE AN ACCOUNT</h2>
<img src="images/sign.up.jpg" alt="Precision Auto Sign Up Page" />

<h2 align="center">SCHEDULE A SERVICE</h2>
<img src="images/ScheduleService.jpg" alt="Scheduling a Service Page" />

## Future Timeline – Precision Auto Repair Portal Features

Expected by Dec. 2025

#### Admin Portal Features

- View and manage estimate reviews

- Access past repair records

- Update photos on the landing page and about page

- Track their inventory

#### Client Portal Features

- Track vehicle status in real time

- Leave reviews after the service

- Access past service records for their vehicle

- Submit a review estimate to the company
