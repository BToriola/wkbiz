import React, { useState, useEffect } from "react";
import Card from "./Card";
import TaskModal from "../modals/TaskModal";
import Image from "next/image";
import { Oval } from "react-loading-icons";
import { useQuery } from "react-query";
import { getAllTasks } from "../../pages/api/taskApi";
import { AvatarAlt, AddReminderIcon } from "../icons";

const CardList = ({
  // tasks, tasksByMe,
  menu,
  loading,
  sortBy,
  filterBy,
}) => {
  const { data, isError, isLoading } = useQuery(["tasks"], getAllTasks);
  const [showTaskModal, setShowTaskModal] = useState("hidden");
  const [TASKS, setTASKS] = useState([]);

  const [TASKSBYME, setTASKSBYME] = useState([]);

  useEffect(() => {
    if (data) {
      const data2 = data?.data
      const profileID = localStorage.getItem("profileID");
      let filtered = data?.data?.filter((item) => {
        if (item.assignerProfileID == profileID) {
          return true;
        }
      });
      setTASKS(data2);
      setTASKSBYME(filtered);
    }
  }, [data]);

  /***Taiwo please attend to this */

  // const fliterByFunc = (value) => {
  //   const res = tasks.filter((item) => item.status === value);
  //   setTASKS(res);
  // };

  // const sortByFunc = (value) => {
  //   if (!value) return;
  //   if (Array.isArray(TASKS) && TASKS.length > 0) {
  //     let dataRecent = TASKS.sort((a, b) => {
  //       if (value === "OLDEST") {
  //         return a.timeCreated - b.timeCreated;
  //       } else {
  //         return b.timeCreated - a.timeCreated;
  //       }
  //     });

  //     setTASKSBYME(dataRecent);
  //   }
  // };
  // useEffect(() => {
  //   fliterByFunc(filterBy);
  // }, [filterBy]);
  // useEffect(() => {
  //   sortByFunc(sortBy);
  // }, [sortBy]);
  // useEffect(() => {
  //   setTASKSBYME(tasksByMe);
  // }, [tasksByMe]);
  // useEffect(() => {
  //   setTASKS(tasks);
  //   fliterByFunc("NEW");
  // }, [tasks && !sortBy && !filterBy]);

  // useEffect(()=>{
  //   setTASKS(allTasks?.tasks?.data)
  // }, [allTasks?.tasks])

  // if (allTasks.tasks.isLoading && !allTasks?.tasks?.data)

  if (isError) {
    return (
      <div className=" text-black flex justify-center text-xl items-center font-bold mt-[200px]">
        <p>Oops!! Something went wrong</p>
      </div>
    );
  }

  if (data?.data?.length === 0)
    return (
      <div className=" flex flex-col   justify-center overflow-scroll ">
        <div className=" mx-auto py-8 ">
          <AvatarAlt />
        </div>

        <div>
          <p className="w-2/5 text-sm  mx-auto text-center text-[#648B7A] ">
            You Have Not Assign Any Task Click The Button “New Task” Button
            Below To Assign New Task
          </p>
        </div>

        <div>
          <div className="text-center">
            <AddReminderIcon
              className="inline"
              onClick={() => setShowTaskModal("block")}
            />
          </div>
        </div>
        <TaskModal
          display={showTaskModal}
          loading={isLoading}
          tasks={TASKS}
          close={() => {
            setShowTaskModal("hidden");
          }}
        />
      </div>
    );

  return (
    <React.Fragment>
      {menu === "My Tasks" && (
        <div className="flex flex-wrap flex-row lg:w-full sm:w-96 gap-4  pt-8">
          {Array.isArray(TASKS) &&
            TASKS.length > 0 &&
            TASKS.map((task, id) => {
              return <Card task={task} tasks={TASKS} />;
            })}
        </div>
      )}
      {menu === "Assigned By Me" && (
        <div className="flex flex-wrap flex-row lg:w-full sm:w-96 gap-4  pt-8">
          {Array.isArray(TASKSBYME) &&
            TASKSBYME.length > 0 &&
            TASKSBYME.map((meTask, id) => {
              return <Card task={meTask} tasks={TASKS} />;
            })}
        </div>
      )}

      <div
        className="fixed right-3 md:right-28 bottom-6 md:bottom-14 cursor-pointer"
        onClick={() => setShowTaskModal("block")}
      >
        <Image
          src="/icons/addForm.svg"
          alt="Wakanda"
          width={80}
          height={80}
          onClick={() => setShowTaskModal("block")}
        />
      </div>
      <TaskModal
        display={showTaskModal}
        loading={isLoading}
        tasks={TASKS}
        close={() => {
          setShowTaskModal("hidden");
        }}
      />
    </React.Fragment>
  );
};

export default CardList;
