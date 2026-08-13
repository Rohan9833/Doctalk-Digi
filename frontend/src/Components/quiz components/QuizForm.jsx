import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { NotepadText, Trash2, Plus, Menu, Check } from "lucide-react";
import { showError, showSuccess } from "../../utils/alert";
import axios from "axios";

export default function QuizForm({cancel, campaign}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      version: "",
      topic: "",
      campaign: "",
      timePerQuestion: "",
      status: "draft",
      questions: [
        {
          question: "",
          questionNumber: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchQuestions = watch("questions");

  const onSubmit = async (data) => {

  const payload = {
    ...data,
    questions: data.questions.map((q, i) => ({
      ...q,
      questionNumber: i + 1,
    })),
  };
    const response = await axios.post("/api/quizzes", payload)

    if(response.status === 200) {
        showSuccess(response.data?.message)
        reset();
    }else {
        showError("Something went wrong.")
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-[#F8FAFC] p-8 text-slate-700 font-sans">
      {/* Top Header Row */}
      <div className="max-w-[1400px] mx-auto mb-6">
        <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
          <span>Quizzes</span>
          <span>&gt;</span>
          <span className="text-slate-600 font-medium">Create Quiz</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900 text-2xl tracking-tight">Create Quiz</h1>
            <p className="text-sm text-slate-500 mt-0.5">Add quiz details and questions</p>
          </div>

          <div className="flex gap-3">
            <button onClick={cancel} type="button" className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg transition">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Form Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quiz Information Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <NotepadText size={18} className="text-violet-600" />
              </div>
              <h2 className="font-semibold text-slate-800 text-base">Quiz Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Quiz Name <span className="text-red-500">*</span></label>
                <input 
                  {...register("name", { required: true })}
                  className="border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2 text-sm text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Version <span className="text-red-500">*</span></label>
                <input 
                  {...register("version", { required: true })}
                  className="border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2 text-sm text-slate-800 bg-white"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Topic <span className="text-red-500">*</span></label>
                <select 
                  {...register("topic")} 
                  className="border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2 text-sm text-slate-800 bg-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
                >
                    <option>Select Topic</option>

                  {campaign.map(c => (
                    <option key={c._id} value={c.topic}>{c.topic}</option>
                  )
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Campaign <span className="text-red-500">*</span></label>
                <select 
                  {...register("campaign")} 
                  className="border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2 text-sm text-slate-800 bg-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
                >

                    <option>Select Campaign</option>

                  {campaign.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  )
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Time Per Question (Seconds) <span className="text-red-500">*</span></label>
                <input 
                  type="number"
                  {...register("timePerQuestion", { required: true,
                    valueAsNumber: true
                   })}
                  className="border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2 text-sm text-slate-800 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Status <span className="text-red-500">*</span></label>
                <select 
                  {...register("status")} 
                  className="border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2 text-sm text-slate-800 bg-white appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25em' }}
                >
                    <option>Select Status</option>
                  <option value="active">● Active</option>
                  <option value="draft">● Draft</option>
                  <option value="archived">● Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Questions List */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const selectedAnswer = watchQuestions?.[index]?.correctAnswer;
              
              return (
                <div key={field.id} className="border border-slate-100 rounded-xl p-6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 text-sm">
                      Question {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-slate-400 hover:text-red-500 transition"
                      title="Delete Question"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Setup Question Fields Area */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-600">Question Text <span className="text-red-500">*</span></label>
                        <textarea 
                          {...register(`questions.${index}.question`, { required: true })}
                          placeholder="What is the most common symptom of GERD?"
                          rows={2}
                          className="w-full border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2.5 text-sm text-slate-800 resize-none"
                        />

                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs font-semibold text-slate-600 block">Options <span className="text-red-500">*</span></label>
                        {[0, 1, 2, 3].map((optionIndex) => {
                          const letter = String.fromCharCode(65 + optionIndex);
                          const isCorrect = selectedAnswer === String(optionIndex);
                          
                          return (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <div className="flex items-center justify-center font-medium bg-slate-50 border border-slate-200 rounded-lg text-xs w-9 h-9 text-slate-500 shrink-0">
                                {letter}
                              </div>
                              <div className="relative w-full flex items-center">
                                <input 
                                  {...register(`questions.${index}.options.${optionIndex}`, { required: true })}
                                  placeholder={`Option ${letter}`}
                                  className="w-full border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-800 bg-white"
                                />
                                <div className="absolute right-3 flex items-center">
                                  <input 
                                    type="radio"
                                    value={optionIndex}
                                    id={`q-${index}-opt-${optionIndex}`}
                                    {...register(`questions.${index}.correctAnswer` )}
                                    className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 accent-indigo-600"
                                  />
                                </div>
                              </div>
                              {optionIndex > 1 && (
                                <button type="button" className="text-slate-400 hover:text-red-500 transition shrink-0">
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Setup Explanatory Right-Side Area inside the card */}
                    <div className="md:col-span-5 flex flex-col justify-between space-y-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl">
                      <div>
                        <span className="text-xs font-semibold text-slate-600 block mb-3">Correct Answer <span className="text-red-500">*</span></span>
                        <div className="space-y-2">
                          {[0, 1, 2, 3].map((optionIndex) => {
                            const letter = String.fromCharCode(65 + optionIndex);
                            const currentOptionVal = watchQuestions?.[index]?.options?.[optionIndex] || `Option ${letter}`;
                            const isChecked = selectedAnswer === String(optionIndex);

                            return (
                              <label key={optionIndex} className="flex items-center gap-2.5 cursor-pointer group">
                                <input 
                                  type="radio" 
                                  value={optionIndex}
                                  checked={isChecked}
                                  {...register(`questions.${index}.correctAnswer` )}
                                  className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500 accent-indigo-600"
                                />
                                <span className={`text-xs ${isChecked ? 'font-medium text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>
                                  {letter}. {currentOptionVal}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 relative">
                        <label className="text-xs font-semibold text-slate-600">Explanation <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <textarea 
                            {...register(`questions.${index}.explanation` , { required: true })}
                            placeholder="Add explanation logic..."
                            rows={3}
                            className="w-full border border-slate-200 focus:outline-none focus:border-violet-500 rounded-lg p-2.5 pr-8 text-sm text-slate-800 bg-white resize-none"
                          />
                          <div className="absolute bottom-3 right-3 text-emerald-500 bg-emerald-50 rounded-full p-0.5">
                            <Check size={14} strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Main Stack Question Block */}
          <button
            type="button"
            onClick={() => append({ question: "", options: ["", "", "", ""], correctAnswer: "0", explanation: "" })}
            className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 text-indigo-600 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
          >
            <Plus size={16} /> Add Question
          </button>
        </div>

        {/* Right Sticky Column Pane: Active List Preview */}
        <div className="lg:col-span-1 lg:sticky lg:top-8 bg-white border border-slate-100 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Questions ({fields.length})</h3>
            <p className="text-xs text-slate-400">Add, edit or reorder questions</p>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {fields.map((field, idx) => {
              const currentText = watchQuestions?.[idx]?.question;
              return (
                <div 
                  key={field.id} 
                  className="flex items-center justify-between border border-slate-100 rounded-lg p-3 bg-white hover:bg-slate-50 transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Menu size={14} className="text-slate-300 grab cursor-move shrink-0" />
                    <span className="text-xs font-semibold text-slate-400 shrink-0">{idx + 1}</span>
                    <span className="text-xs text-slate-700 font-medium truncate pr-2">
                      {currentText ? currentText : `New Question Structure Template`}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(idx)}
                    className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => append({ question: "", options: ["", "", "", ""], correctAnswer: "0", explanation: "" })}
            className="w-full border border-slate-200 hover:border-indigo-300 text-indigo-600 py-2.5 mt-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Plus size={14} /> Add Question
          </button>
        </div>

      </div>

      {/* Global Form Submission Footer Actions */}
      <div className="max-w-[1400px] mx-auto border-t border-slate-200/60 mt-8 pt-6 flex items-center justify-end gap-3">
        <button type="button" className="px-5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg transition">
          Cancel
        </button>
        <button onClick={() => {
              console.log("ERRORS", errors);
    console.log("WATCH", watch());

        }} type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition shadow-sm">
          Publish Quiz
        </button>
      </div>
    </form>
  );
}