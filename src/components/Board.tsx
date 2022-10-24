import { useFilter, useLengthyRef, usePushableState } from "../interactivity";
import styled from "styled-components";
import Task, { TaskProps } from "./Task";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { canUseLayoutEffect } from "@apollo/client/utilities";
import { useEffect, useRef, useState } from "react";
import yeast from "yeast";
import Toolbar from "./Toolbar";
import Search from "./Search";
import { gql, OperationResult } from "urql";
import { useSupabaseClient } from "./SupabaseProvider";
import { useUserSession } from "./UserProvider";
import Tag, { TagProps } from "./Tag";

export interface BoardProps {
  id: string;
  name: string;
  stages: Stage[];
  allTags: TagProps[];
}

export interface Stage {
  id?: string;
  name: string;
  tasks: TaskProps[],
  filter?: string
}

export interface StageExport {
    id?: string,
    name: string,
    tasks: TaskProps[]
}

interface StageProps {
  width: string;
}

interface QuickActionProps {
  icon: string;
}

export default function Board( props: BoardProps) {
  const [stages, pushStage] = usePushableState<Stage>(props.stages);
  // this is maintained separately of the tasks actually in stages. remember to sync
  const [tasks, pushTask] = usePushableState<TaskProps>(stages.map(stage => stage.tasks).flat(1));
  const [tags, pushTag, setTagValue] = usePushableState<TagProps>(props.allTags)
  const [filteredTasks, setFilter] = useFilter<TaskProps>(tasks, globalSearchPredicate);
  const [localFilteredTasks, setLocalFilter] = useFilter<TaskProps>(tasks, globalSearchPredicate);
  const [pickupStageId, setPickupStageId] = useState("none");
  const [dropStageId, setDropStageId] = useState("none");
  const [transientTask, setTransientTask] = useState<TaskProps | null>(null);
  const [lastModifiedTime, setLastModifiedTime] = useState(new Date())

  const pickupStage = stages.find(stage => stage.id === pickupStageId);
  const dropStage = stages.find(stage => stage.id === dropStageId) ?? pickupStage;

  const supabase = useSupabaseClient();
  const session = useUserSession();

  async function save() {
    console.log("saving", stages);
    return await supabase
      .from("profiles")
      .update({
        board: {
          id: props.id,
          name: props.name,
          stages: (stages as StageExport[]),
          allTags: tags
        },
      })
      .eq("id", session?.user.id);
  }

  function onDragEnter(evt: React.DragEvent) {
    const target = evt.target as HTMLDivElement;

    setDropStageId(target.getAttribute("data-id") ?? "none");
  }

  function onDragStart(stageId: string, taskId: string) {
    setTransientTask(tasks.find(task => task.id === taskId) ?? tasks[0]);
    setPickupStageId(stageId);
  }

  function drop(evt: React.DragEvent) {
    const target = evt.target as HTMLDivElement;

    if (!transientTask) {
      console.log("Src task was null");
      return;
    }

    pushTask(transientTask);

    pickupStage?.tasks.splice(pickupStage.tasks.indexOf(transientTask), 1);
    dropStage?.tasks.push(transientTask);

    setTransientTask(null);

    save().then(res => console.log(res.data, res.error));
  }

  function mutateTaskDescription(context: { taskId: string; stageId: string }, description: string) {
    const stage = stages[stages.findIndex(stage => stage.id === context.stageId)];

    stage.tasks[stage.tasks.findIndex(task => task.id === context.taskId)].description = description;

    save().then(res => console.log(res, description));
  }

  function createTask(stageId: string, properties: TaskProps) {
    const stage = stages[stages.findIndex(stage => stage.id === stageId)];

    stage.tasks.push(properties);

    pushTask(properties);

    save().then(res => console.log(res, properties));
  }

  function removeTask(context: { taskId: string; stageId: string }) {
    console.log(context)
    const stage = stages[stages.findIndex(stage => stage.id === context.stageId)];

    stage.tasks.splice(stage.tasks.findIndex(task => task.id === context.taskId), 1)

    setLastModifiedTime(new Date())

    save().then(res => console.log(res, context));
  }

  function blankTask(stageId: string) {
    return {
      title: "",
      description: "Empty task",
      tags: [],
      stageId: stageId
    };
  }

  function addTag(context: { taskId: string; stageId: string }, tag: TagProps) {
    const stage = stages[stages.findIndex(stage => stage.id === context.stageId)];
    const task = stage.tasks[stage.tasks.findIndex(task => task.id === context.taskId)];
    const id = yeast()
    task.tags.push({ id: id });

    pushTag({
        id: id,
        value: tag.value,
        color: tag.color
    })

    save().then(res => console.log(res, tag));
  }

  function changeTagIndex(context: { taskId: string; stageId: string, tagId: string }, tagIndex: string) {
    console.log(context)
    const stage = stages[stages.findIndex(stage => stage.id === context.stageId)];
    const task = stage.tasks[stage.tasks.findIndex(task => task.id === context.taskId)];
    const tag = task.tags[task.tags.findIndex(tag => tag.id === context.tagId)]

    tag.id = tagIndex
    setLastModifiedTime(new Date())
    save().then(res => console.log(res, tag));
  }

  function mutateTag(tagID: string, mutation: TagProps) {
    setTagValue(tags.findIndex(tag => tag.id === tagID), mutation)
    save().then(res => console.log(res, mutation));
  }

  function globalSearchPredicate(value: TaskProps, filter: { search: string; contextId: string }) {
    return value.description.toLowerCase().includes(filter.search.toLowerCase());
  }

  for(let i = 0; i < tags.length; i++) {
    !tags[i].id && (tags[i].id = yeast())
  }

  return (
    <Wrapper>
      <Toolbar onFilter={setFilter} />
      <Stages>
        {stages.map(stage => {
          !stage.id && (stage.id = yeast());
          return (
            <Stage
              key={stage.name}
              width={`calc(100vw / ${stages.length})`}
              data-id={stage.id}
              onDragEnter={onDragEnter}
              onDragOver={evt => evt.preventDefault()}
              onDrop={drop}
            >
              <StageHeader>
                <h2>{stage.name}</h2>
                <QuickAction icon="/asterisk.svg" onClick={_ => createTask(stage.id ?? "", blankTask(stage.id ?? ''))}>
                  NEW TASK
                </QuickAction>
              </StageHeader> 
              <Search whiteBackground={true} placeholder={"SEARCH"} onFilter={filter => { setLocalFilter(filter); return stage.filter = filter.search}} contextId={stage.id}/>
              <Tasks>
                {stage.tasks.map(task => {
                    !task.id && (task.id = yeast());
                    task.stageId = stage.id ?? ''
                    return (
                      <Task
                        key={task.id}
                        id={task.id}
                        description={task.description}
                        stageId={stage.id ?? ""}
                        tags={task.tags}
                        onDragStart={onDragStart}
                        allTags={tags}
                        mutateDescription={mutateTaskDescription}
                        addTag={addTag}
                        mutateTag={mutateTag}
                        changeTagIndex={changeTagIndex}
                        removeTask={removeTask}
                        visibility={filteredTasks.includes(task) && ((stage.filter && stage.filter.length > 0) ? task.description.toLowerCase().includes(stage.filter.toLowerCase()) : true)}
                      />
                    );
                  })}
              </Tasks>
              {transientTask && dropStageId === stage.id && (
                <DropPreview>
                  <Task
                    key={transientTask.id}
                    id={transientTask.id}
                    description={transientTask.description}
                    stageId={stage.id ?? ""}
                    tags={transientTask.tags}
                    onDragStart={onDragStart}
                    allTags={tags}
                    mutateDescription={() => {}}
                    addTag={() => {}}
                    mutateTag={() => {}}
                    changeTagIndex={() => {}}
                    removeTask={() => {}}
                    visibility={true}
                  />
                </DropPreview>
              )}
            </Stage>
          );
        })}
        <AddStage onClick={_ => pushStage({ name: "NEW STAGE", tasks: [] })}>+</AddStage>
      </Stages>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  height: 100%;
`;

const Stages = styled.div`
  width: 100%;

  flex: 1 1 auto;
  display: flex;
  column-gap: 2rem;
  color: white;
  margin-top: 0.5rem;

  h2 {
    letter-spacing: 1px;
    margin: 0;
    flex: 1 1 auto;
  }
`;

const Stage = styled.div<StageProps>`
  border: solid 1px #7604f1;
  border-right: none;
  flex: 1 1 auto;
  padding: 0.5rem;
  width: ${props => props.width};
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  background-color: white;
  color: black;
  overflow: hidden;
`;

const AddStage = styled.div`
  width: 4rem;
  border: solid 1px #7604f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin-right: 1rem;

  &:hover {
    background-color: black;
  }
`;

const Tasks = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
`;

const DropPreview = styled.div`
  pointer-events: none;
  opacity: 25%;
  outline: solid 2px #7604f1;
`;

const StageHeader = styled.div`
  display: flex;
  width: 100%;
`;

const QuickAction = styled.button<QuickActionProps>`
  display: flex;
  align-items: center;
  font-family: "Prompt";
  font-weight: 500;
  font-size: 1rem;
  background: none;
  border: none;
  padding: 9px 15px 9px 15px;
  cursor: pointer;

  &:hover {
    background-color: #7604f1;
    color: white;

    &::before {
      filter: invert(100%);
    }
  }

  &::before {
    content: url(${props => props.icon});
    margin-right: 0.5rem;
    margin-top: 0.25rem;
  }
`;
