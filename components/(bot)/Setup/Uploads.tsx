"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EyeIcon } from "lucide-react";
import { pdfToText } from 'pdf-ts';
import { useVoiceClient } from 'realtime-ai-react';

export default function Component() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [error, setError] = useState("");

  const voiceClient = useVoiceClient()



  async function extractTextFromPdf(file: File): Promise<string> {
    const fileReader = new FileReader();
    const textPromise = new Promise((resolve, reject) => {
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result;
        pdfToText(arrayBuffer).then((text) => {
          resolve(text);
        }).catch((err) => {
          reject(err);
        });
      };
      fileReader.readAsArrayBuffer(file);
    });
    return textPromise;
  }

  const handleFileUpload = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (file) {
      if (fileInput.id === "resume") {
        setResumeFile(file);
        setResumeText("Extracting text...");
        
      } else if (fileInput.id === "job-description") {
        setJobDescriptionFile(file);
        setJobDescriptionText("Extracting text...");
      }

      try {
        const text = await extractTextFromPdf(file);
        if (fileInput.id === "resume") {
          setResumeText(text || "No text could be extracted from the PDF.");
        
        voiceClient.appendLLMContext()(
            {
                role: "assistant",
                content: `resume: ${text}`
            },
        )
        } else if (fileInput.id === "job-description") {
          setJobDescriptionText(text || "No text could be extracted from the PDF.");
        
          voiceClient.appendLLMContext()(
            {
                role: "assistant",
                content: `job and company description: ${text}`
            },
        )
        }
      } catch (err) {
        console.error("Error in handleFileUpload:", err);
        setError("An error occurred while processing the file. Please try again.");
      }
    }
  };

  const PdfViewer = ({ file, title }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <EyeIcon className="h-4 w-4" />
          <span className="sr-only">View PDF</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <iframe src={URL.createObjectURL(file)} className="w-full h-[80vh]" title={title} />
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Upload</CardTitle>
        <CardDescription>Please upload your resume and the job description you're applying for.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex flex-col gap-2">
          <Label htmlFor="resume">Resume (PDF)</Label>
          <div className="flex items-center gap-2">
            <Input id="resume" type="file" accept=".pdf" onChange={handleFileUpload} />
            {resumeFile && (
              <div className="flex items-center gap-2">
                <PdfViewer file={resumeFile} title="Resume" />
              </div>
            )}
          </div>
        {resumeText && (
          <div className="text-sm">Resume text: {resumeText}</div>
        )}
          
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="job-description">Job Description (PDF)</Label>
          
          <div className="flex items-center gap-2">

            <Input id="job-description" type="file" accept=".pdf" onChange={handleFileUpload} />
            {jobDescriptionFile && (
              <div className="flex items-center gap-2">
                <PdfViewer file={jobDescriptionFile} title="Job Description" />
              </div>
            )}
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}