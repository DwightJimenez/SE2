import React from "react";
import PageLoc from "../components/PageLoc";

const Evaluation = () => {
  return (
    <div>
      <PageLoc currentPage="Evaluation" />
      <div className="flex justify-center mb-4 h-auto max-w-200 bg-white rounded-lg shadow-lg dark:bg-gray-900 p-4">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeHIqN_hMgmoHc9ECCzyNOpUJhRAbtVOXubIzYMFeSRWqPrQA/viewform?usp=dialog"
          width="640"
          height="800"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading...
        </iframe>
      </div>
    </div>
  );
};

export default Evaluation;
