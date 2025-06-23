"use client"
import Navbar from "@/components/Navbar";
import { GoogleGenAI } from "@google/genai";
import { Plus, Send, User, Building, Mail, Phone, Link, Briefcase, FileText, X } from "lucide-react";
import { useState } from "react";


export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDetailsForm, setOpenDetailsForm] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    company: "",
    jobTitle: "",
    phone: "",
    portfolio: "",
    email: "",
    hrEmail: "",
    experience: "",
    skills: ""
  });

  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

  const handleInputChange = (field, value) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenForm = () => {
    setOpenDetailsForm(!openDetailsForm);
  };

  const validateInputs = () => {
    if (!jobDescription.trim()) {
      alert("Please enter a job description");
      return false;
    }
    if (!userDetails.name.trim()) {
      alert("Please enter your name");
      return false;
    }
    if (!userDetails.email.trim()) {
      alert("Please enter your email");
      return false;
    }
    return true;
  };

  async function handleGenerateEmail() {
    if (!validateInputs()) return;

    setLoading(true);
    setGeneratedEmail("");

    try {
      const detailedPrompt = `You are an expert cold email writer helping students write professional job application emails to HR.

      Create a compelling, personalized cold email using the following information. 
      IMPORTANT: Remember the output will be directly sent to the HR person. so strictly do not include any placeholders, variables, or bracketed text (e.g., [insert here], [Platform name]). All fields provided below should be used as-is. If a field is missing, omit that detail naturally without adding placeholders.

      JOB DESCRIPTION:
      ${jobDescription}

      STUDENT DETAILS:
      - Name: ${userDetails.name}
      - Target Company: ${userDetails.company || "the company"}
      - Desired Job Title: ${userDetails.jobTitle || "the position"}
      - Phone: ${userDetails.phone}
      - Portfolio/LinkedIn: ${userDetails.portfolio}
      - Email: ${userDetails.email}
      - HR Email: ${userDetails.hrEmail}
      - Experience: ${userDetails.experience}
      - Key Skills: ${userDetails.skills}

      ADDITIONAL INSTRUCTIONS:
      ${customPrompt}

      REQUIREMENTS:
      1. Write a professional subject line
      2. Address the HR person professionally (use "Dear Hiring Manager" if HR name not provided)
      3. Create an engaging opening that mentions the specific role
      4. Highlight relevant skills and experience that match the job description
      5. Include a brief value proposition - what the student can bring to the company
      6. Mention portfolio/LinkedIn if provided
      7. Include a professional closing with contact information
      8. Keep it concise but impactful (200-300 words)
      9. Use a confident but humble tone appropriate for a student
      10. Make it personalized to the company and role

      Format the response as a complete, ready-to-send email with no placeholders or missing parts.`;


      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash-8b",
        contents: detailedPrompt,
      });

      setGeneratedEmail(response.text || "No response from AI.");
    } catch (error) {
      console.error("Error:", error);
      setGeneratedEmail("Error generating email. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    alert("Email copied to clipboard!");
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-white font-bold text-4xl mb-2">AI Cold Email Agent</h1>
          <p className="text-gray-400 text-lg">Generate professional job application emails that get noticed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <label className="block text-white font-semibold mb-2">Job Description *</label>
            <textarea
              className="w-full bg-gray-900 text-white border-2 border-gray-700 shadow-sm shadow-white rounded-lg p-4 font-medium text-base h-32 focus:border-blue-500 focus:outline-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here..."
            />
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleOpenForm}
              className="flex items-center justify-center gap-2 text-white border-2 border-gray-700 shadow-sm shadow-white rounded-lg p-4 font-semibold text-lg hover:bg-gray-800 transition-all"
            >
              <User size={20} />
              {openDetailsForm ? "Hide Details" : "Fill Your Details"}
              {openDetailsForm ? <X size={20} /> : <Plus size={20} />}
            </button>

            <button
              onClick={handleGenerateEmail}
              disabled={loading}
              className="flex items-center justify-center gap-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm shadow-white rounded-lg p-4 font-semibold text-lg cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {loading ? "Generating..." : "Generate Cold Email"}
            </button>
          </div>
        </div>

        {openDetailsForm && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-white font-bold text-xl mb-6">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-400" />
                <input
                  className="flex-1 bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your Full Name *"
                />
              </div>

              <div className="flex items-center gap-2">
                <Building size={20} className="text-gray-400" />
                <input
                  className="flex-1 bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={userDetails.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Target Company Name"
                />
              </div>

              <div className="flex items-center gap-2">
                <Briefcase size={20} className="text-gray-400" />
                <input
                  className="flex-1 bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={userDetails.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="Desired Job Title"
                />
              </div>

              <div className="flex items-center gap-2">
                <Phone size={20} className="text-gray-400" />
                <input
                  className="flex-1 bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={userDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone Number"
                />
              </div>

              <div className="flex items-center gap-2">
                <Link size={20} className="text-gray-400" />
                <input
                  className="flex-1 bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={userDetails.portfolio}
                  onChange={(e) => handleInputChange('portfolio', e.target.value)}
                  placeholder="Portfolio/LinkedIn URL"
                />
              </div>

              <div className="flex items-center gap-2">
                <Mail size={20} className="text-gray-400" />
                <input
                  className="flex-1 bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Your Email Address *"
                />
              </div>

              <div className="md:col-span-2">
                <textarea
                  className="w-full bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium h-24 focus:border-blue-500 focus:outline-none"
                  value={userDetails.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Brief description of your experience/projects (optional)"
                />
              </div>

              <div className="md:col-span-2">
                <input
                  className="w-full bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium focus:border-blue-500 focus:outline-none"
                  type="text"
                  value={userDetails.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="Key skills (e.g., React, Python, Data Analysis)"
                />
              </div>

              <div className="md:col-span-2">
                <textarea
                  className="w-full bg-black text-white border-2 border-gray-700 rounded-lg p-3 font-medium h-20 focus:border-blue-500 focus:outline-none"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Additional instructions for the AI (optional)"
                />
              </div>
            </div>
          </div>
        )}

        {generatedEmail && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-bold text-xl">Generated Cold Email</h2>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Copy Email
              </button>
            </div>
            <div className="bg-black border border-gray-700 rounded-lg p-4">
              <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {generatedEmail}
              </pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}