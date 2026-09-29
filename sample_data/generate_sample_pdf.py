import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas

def create_sample_answer_sheet(output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter # 612 x 792 points

    pages_data = [
        {
            "page_num": 1,
            "title": "EXAMINATION ANSWER SHEET — PAGE 1 OF 6",
            "question": "Question 1: Evaluate integral I = ∫ (3x^2 + 2x + 1) dx from 0 to 2",
            "student_work": [
                "Step 1: Find antiderivative F(x) = x^3 + x^2 + x",
                "Step 2: F(2) = 2^3 + 2^2 + 2 = 8 + 4 + 2 = 14",
                "Step 3: F(0) = 0",
                "Final Answer: I = 14 - 0 = 14",
                "----------------------------------------------------",
                "Examiner Note: Checked ✓ [Marks: 5/5]"
            ],
            "extra_note": None
        },
        {
            "page_num": 2,
            "title": "EXAMINATION ANSWER SHEET — PAGE 2 OF 6",
            "question": "Question 2: Linear Algebra — Find inverse of matrix A = [[2, 1], [4, 3]]",
            "student_work": [
                "det(A) = (2)(3) - (1)(4) = 6 - 4 = 2 ≠ 0",
                "adj(A) = [[3, -1], [-4, 2]]",
                "A^(-1) = (1/det(A)) * adj(A) = 1/2 * [[3, -1], [-4, 2]]",
                "A^(-1) = [[1.5, -0.5], [-2, 1]]",
                "----------------------------------------------------",
                "Examiner Note: Checked ✓ [Marks: 5/5]"
            ],
            "extra_note": None
        },
        {
            "page_num": 3,
            "title": "EXAMINATION ANSWER SHEET — PAGE 3 OF 6",
            "question": "Question 3: Solve Differential Equation dy/dx + 2y = e^(-x), y(0) = 1",
            "student_work": [
                "Integrating factor I(x) = e^(∫ 2 dx) = e^(2x)",
                "d/dx [y * e^(2x)] = e^(2x) * e^(-x) = e^x",
                "y * e^(2x) = ∫ e^x dx = e^x + C",
                "y(x) = e^(-x) + C * e^(-2x)",
                "----------------------------------------------------",
                "Examiner Mark recorded: 3/5 (Incomplete boundary evaluation?)"
            ],
            "extra_note": {
                "box": (320, 100, 240, 140), # x, y, w, h
                "title": "Unchecked Intermediate Calculation (Lower Right):",
                "lines": [
                    "Boundary condition calculation:",
                    "y(0) = 1 => 1 = e^0 + C*e^0",
                    "1 = 1 + C => C = 0",
                    "Hence particular solution: y(x) = e^(-x)",
                    "[Examiner missed evaluating this working!]"
                ]
            }
        },
        {
            "page_num": 4,
            "title": "EXAMINATION ANSWER SHEET — PAGE 4 OF 6",
            "question": "Question 4: Mechanics — Block sliding down frictionless incline of height h=5m",
            "student_work": [
                "Find final velocity v at the bottom of the incline.",
                "Primary Working:",
                "Using kinematics: a = g sin(θ)",
                "v^2 = u^2 + 2as  =>  v = sqrt(2 * 9.8 * 5)",
                "v = sqrt(98) = 9.9 m/s",
                "----------------------------------------------------",
                "Examiner Mark recorded: 4/5"
            ],
            "extra_note": {
                "box": (50, 80, 500, 130),
                "title": "ROUGH WORK / SCRATCH SPACE (Bottom Margin):",
                "lines": [
                    "Alternative Energy Conservation Derivation:",
                    "E_initial = m * g * h , E_final = 0.5 * m * v^2",
                    "m * g * h = 0.5 * m * v^2  =>  v = sqrt(2gh) = sqrt(2 * 9.8 * 5) = 9.9 m/s",
                    "Alternative proof verified energy conservation law explicitly.",
                    "[Potentially eligible for bonus reasoning credit]"
                ]
            }
        },
        {
            "page_num": 5,
            "title": "EXAMINATION ANSWER SHEET — PAGE 5 OF 6",
            "question": "Question 5: Probability — Bayes' Theorem for Medical Test Accuracy",
            "student_work": [
                "P(Disease) = 0.01, P(+|Disease) = 0.99, P(+|No Disease) = 0.05",
                "P(+) = (0.99)(0.01) + (0.05)(0.99) = 0.0099 + 0.0495 = 0.0594",
                "P(Disease|+) = 0.0099 / 0.0594 = 0.1667 (16.67%)",
                "----------------------------------------------------",
                "Examiner Note: Checked ✓ [Marks: 5/5]"
            ],
            "extra_note": None
        },
        {
            "page_num": 6,
            "title": "EXAMINATION ANSWER SHEET — PAGE 6 OF 6",
            "question": "[END OF ANSWER BOOKLET]",
            "student_work": [
                "This page left intentionally blank for additional answers if required."
            ],
            "extra_note": None
        }
    ]

    for p in pages_data:
        # Header
        c.setFillColor(colors.HexColor("#1e293b"))
        c.rect(0, 740, 612, 52, fill=True, stroke=False)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(30, 758, p["title"])
        
        # Student info bar
        c.setFillColor(colors.HexColor("#f1f5f9"))
        c.rect(0, 710, 612, 30, fill=True, stroke=False)
        c.setFillColor(colors.HexColor("#475569"))
        c.setFont("Helvetica", 10)
        c.drawString(30, 720, "Candidate ID: STU-2026-8942 | Course: ADV-MATH-301 | Date: Sept 2026")

        # Question Title
        c.setFillColor(colors.HexColor("#0f172a"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30, 675, p["question"])
        c.setStrokeColor(colors.HexColor("#cbd5e1"))
        c.setLineWidth(1)
        c.line(30, 665, 582, 665)

        # Main Student Work
        c.setFont("Courier-Bold", 11)
        c.setFillColor(colors.HexColor("#1e1b4b"))
        y_pos = 635
        for line in p["student_work"]:
            c.drawString(40, y_pos, line)
            y_pos -= 24

        # Extra Note / Highlight Box (if present)
        if p["extra_note"]:
            box_x, box_y, box_w, box_h = p["extra_note"]["box"]
            c.setStrokeColor(colors.HexColor("#eab308"))
            c.setFillColor(colors.HexColor("#fefce8"))
            c.setLineWidth(1.5)
            c.rect(box_x, box_y, box_w, box_h, fill=True, stroke=True)
            
            c.setFillColor(colors.HexColor("#854d0e"))
            c.setFont("Helvetica-Bold", 9)
            c.drawString(box_x + 10, box_y + box_h - 18, p["extra_note"]["title"])
            
            c.setFont("Courier-Oblique", 9)
            c.setFillColor(colors.HexColor("#713f12"))
            ny = box_y + box_h - 34
            for nline in p["extra_note"]["lines"]:
                c.drawString(box_x + 10, ny, nline)
                ny -= 14

        # Page footer grid
        c.setStrokeColor(colors.HexColor("#e2e8f0"))
        c.line(30, 40, 582, 40)
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.setFont("Helvetica", 9)
        c.drawString(30, 25, f"GuardSheet AI Standard Audit Test Spec — Page {p['page_num']} of 6")
        c.drawRightString(582, 25, "CONFIDENTIAL EXAMINATION DOCUMENT")

        c.showPage()

    c.save()
    print(f"Sample PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    out_file = os.path.join(os.path.dirname(__file__), "sample_answer_sheet.pdf")
    create_sample_answer_sheet(out_file)
