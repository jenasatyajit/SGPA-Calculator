import React, { useState } from 'react';
    import { jsPDF } from 'jspdf';
    import 'jspdf-autotable';

    const initialSubjects = [
      'Programming for Problem Solving',
      'Electrical Engineering',
      'Electronics Engineering',
      'Engineering Mechanics',
      'Engineering Physics',
      'Engineering Chemistry',
      'Engineering Mathematics I',
      'Communication Skills',
    ];

    const creditTable = {
      'Programming for Problem Solving': 4,
      'Electrical Engineering': 3,
      'Electronics Engineering': 3,
      'Engineering Mechanics': 3,
      'Engineering Physics': 3,
      'Engineering Chemistry': 3,
      'Engineering Mathematics I': 4,
      'Communication Skills': 3,
    };

    function App() {
      const [semester, setSemester] = useState(1);
      const [subjects, setSubjects] = useState(initialSubjects);
      const [selectedSubjects, setSelectedSubjects] = useState([]);
      const [marks, setMarks] = useState({});
      const [sgpa, setSgpa] = useState(null);
      const [newSubject, setNewSubject] = useState('');
      const [showAddSubject, setShowAddSubject] = useState(false);
      const [subjectToAdd, setSubjectToAdd] = useState('');

      const handleSemesterChange = (e) => {
        setSemester(parseInt(e.target.value, 10));
      };

      const handleSubjectChange = (e) => {
        setSubjectToAdd(e.target.value);
      };

      const handleMarksChange = (subject, e) => {
        setMarks({ ...marks, [subject]: parseFloat(e.target.value) });
      };

      const removeSubject = (subjectToRemove) => {
        setSelectedSubjects(selectedSubjects.filter((subject) => subject !== subjectToRemove));
        const { [subjectToRemove]: removed, ...rest } = marks;
        setMarks(rest);
      };

      const calculateGradePoint = (mark) => {
        if (mark >= 90) return 10;
        if (mark >= 75) return 9;
        if (mark >= 65) return 8;
        if (mark >= 55) return 7;
        if (mark >= 50) return 6;
        if (mark >= 45) return 5;
        if (mark >= 40) return 4;
        return 0;
      };

      const calculateSgpa = () => {
        let totalCredits = 0;
        let weightedSum = 0;

        selectedSubjects.forEach((subject) => {
          const credits = creditTable[subject] || 3;
          const mark = marks[subject] || 0;
          const gradePoint = calculateGradePoint(mark);
          totalCredits += credits;
          weightedSum += gradePoint * credits;
        });

        if (totalCredits > 0) {
          setSgpa((weightedSum / totalCredits).toFixed(2));
        } else {
          setSgpa(0);
        }
      };

      const handleAddSubjectClick = () => {
        setShowAddSubject(true);
      };

      const handleAddSubjectToList = () => {
        if (subjectToAdd && !selectedSubjects.includes(subjectToAdd)) {
          setSelectedSubjects([...selectedSubjects, subjectToAdd]);
          setSubjectToAdd('');
        }
      };

      const handleCloseAddSubject = () => {
        setShowAddSubject(false);
      };

      const handleNewSubjectChange = (e) => {
        setNewSubject(e.target.value);
      };

      const handleAddNewSubject = () => {
        if (newSubject && !subjects.includes(newSubject)) {
          setSubjects([...subjects, newSubject]);
          creditTable[newSubject] = 3;
          setNewSubject('');
        }
      };

      const generatePdf = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('SGPA Report', 10, 10);

        const headers = ['Subject', 'Marks', 'Grade Point'];
        const data = selectedSubjects.map(subject => {
          const mark = marks[subject] || 0;
          const gradePoint = calculateGradePoint(mark);
          return [subject, mark, gradePoint];
        });

        doc.autoTable({
          head: [headers],
          body: data,
          startY: 30,
        });

        const finalY = doc.autoTable.previous.finalY;

        doc.setFontSize(14);
        doc.text(`\nSGPA: ${sgpa}`, 10, finalY + 20);
        doc.save('sgpa_report.pdf');
      };

      const allSubjects = [...subjects];

      return (
        <div>
          <h1>SGPA Calculator</h1>
          <div className="form-group">
            <label>Select Semester:</label>
            <select value={semester} onChange={handleSemesterChange}>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="add-subject-container">
            <input
              type="text"
              placeholder="Add new subject"
              value={newSubject}
              onChange={handleNewSubjectChange}
            />
            <button onClick={handleAddNewSubject}>Add New Subject</button>
          </div>
          {!showAddSubject && (
            <button onClick={handleAddSubjectClick}>Add Subject</button>
          )}
          {showAddSubject && (
            <div className="form-group">
              <label>Select Subject:</label>
              <select onChange={handleSubjectChange}>
                <option value="">-- Select a subject --</option>
                {allSubjects.filter(subject => !selectedSubjects.includes(subject)).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <button onClick={handleAddSubjectToList}>Add</button>
              <button onClick={handleCloseAddSubject}>Close</button>
            </div>
          )}
          <div className="subject-list">
            {selectedSubjects.map((subject) => (
              <div key={subject} className="subject-item">
                <span>{subject}</span>
                <input
                  type="number"
                  placeholder="Marks (out of 100)"
                  min="0"
                  max="100"
                  onChange={(e) => handleMarksChange(subject, e)}
                />
                <button className="remove-button" onClick={() => removeSubject(subject)}>
                  <svg className="remove-icon" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button onClick={calculateSgpa}>Calculate SGPA</button>
          {sgpa !== null && <div className="result">SGPA: {sgpa}</div>}
          {sgpa !== null && <button onClick={generatePdf}>Export to PDF</button>}
        </div>
      );
    }

    export default App;
