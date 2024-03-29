"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Deletebutton({ slug }: { slug: string }) {
  const [check, setCheck] = useState(false);
  const router = useRouter();

  const delOnClickHandler = async (slug: string) => {
    if (check) {
      await fetch(`/api/post_service/?id=${slug}`, {
        method: "DELETE",
      }).then(() => {
        setCheck(false);
      });
    } else {
      setCheck(true);
    }
  };

  return (
    <>
      {check ? (
        <div className="flex flex-col justify-center items-center">
          {/* 삭제하기 버튼 */}
          진짜로 삭제하시겠습니까?
          <div className="flex justify-center items-center gap-4">
            <button
              className="btn btn-error btn-sm"
              onClick={async () => {
                await delOnClickHandler(slug).then(() =>
                  router.push("/meditations")
                );
              }}
            >
              예
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => setCheck(false)}
            >
              아니오
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-primary-content/60"
          onClick={async () => {
            await delOnClickHandler(slug);
          }}
        >
          <div className="flex justify-center items-center">
            {/* 삭제하기 버튼 */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>
        </button>
      )}
    </>
  );
}
