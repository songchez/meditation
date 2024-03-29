"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import riceIcon from "public/icon_rice.svg";

import "react-quill/dist/quill.snow.css";
import "@/styles/customQuill.css";

import { QueryFinder } from "@/components/utils/queryfinder";
import ReadInput from "@/components/readInput";
import dynamic from "next/dynamic";
import { modules } from "./utils/quillModule";

const ReactQuill = dynamic(() => import("react-quill"), {
  loading: () => <p>Loading...</p>,
});

export default function CreatePost({ sessionEmail }: { sessionEmail: string }) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [book, setBook] = useState("창세기");
  const [start, setStart] = useState(["1", "1"]);
  const [end, setEnd] = useState(["1", "1"]);
  const [submitloading, setSubmitloading] = useState(false);

  const handleSubmit = async (e: any) => {
    setSubmitloading(true);
    const queryBook: string = await QueryFinder(book);
    e.preventDefault();
    await fetch("/api/post_service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        authorEmail: sessionEmail,
        whereRead: `${start[0]}장${start[1]}절 ~ ${end[0]}장${end[1]}절`,
        testaBook: book,
        whereReadQuery: `https://yesu.io/bible?lang=kor&doc=${queryBook}&start=${start[0]}:${start[1]}&end=${end[0]}:${end[1]}`,
      }),
    }).then(async (res) => {
      if (res.status === 201) {
        fetch("/api/readCountService", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: sessionEmail,
            book,
            start,
            end,
          }),
        }).then(async (res) => {
          if (res.status === 200) {
            setSubmitloading(false);
            toast.success("묵상포스트가 생성되었습니다!");
          } else {
            toast.error(await res.text());
          }
        });
      } else {
        toast.error(await res.text());
      }
    });
  };

  return (
    <div className="mb-36">
      <ReadInput
        book={book}
        setBook={setBook}
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
      />
      <form onSubmit={handleSubmit}>
        <div className="min-h-[300px] rounded-2xl p-3 bg-transparent shadow-sm shadow-secondary">
          <input
            type="text"
            name="title"
            required
            placeholder="제목:"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            className="input input-ghost w-full max-w-xs my-3 mx-1 text-primary-content text-lg font-bold"
          />
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(text) => {
              setFormData({ ...formData, content: text });
            }}
            modules={modules}
            placeholder="말씀을 읽으면서 📒 묵상한 내용을 적어보세요."
          />
          <div className="flex justify-center m-4">
            <button
              className="btn btn-md border-0 shadow-md shadow-primary"
              type="submit"
              disabled={submitloading}
            >
              <div className="flex justify-center items-center gap-2">
                {submitloading ? (
                  <div
                    className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary-content rounded-full"
                    role="status"
                    aria-label="loading"
                  ></div>
                ) : (
                  <>
                    <Image src={riceIcon} alt="send"></Image>
                    <p className="text-lg text-slate-100">만들기</p>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
