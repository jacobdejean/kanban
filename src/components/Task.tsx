import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import yeast from "yeast";
import { usePushableState } from "../interactivity";
import { Stage } from "./Board";
import Tag, { TagIndex, TagProps } from "./Tag";

export interface TaskProps {
  id?: string;
  description: string;
  tags: TagIndex[];
  stageId?: string;
}

export interface TaskWrapperProps {
  highlighted: boolean;
}

export interface TaskNameProps {
  description: string;
}

interface QuickActionProps {
  icon: string;
}

export default function Task(
  props: TaskProps & {
    onDragStart: (stageId: string, taskId: string) => void;
    mutateDescription: (context: { taskId: string; stageId: string }, description: string) => void;
    addTag: (context: { taskId: string; stageId: string }, tag: TagProps) => void;
    mutateTag: (tagID: string, mutation: TagProps) => void;
    changeTagIndex: (context: { taskId: string; stageId: string, tagId: string }, tagIndex: string) => void;
    allTags: TagProps[];
  }
) {
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState(props.description);
  const [tags, pushTag] = usePushableState(props.tags);

  let descriptionRef = useRef<HTMLDivElement>(null);
  let editableDescriptionRef = useRef<HTMLInputElement>(null);

  function startEdit(evt: React.MouseEvent) {
    evt.stopPropagation();
    setEditMode(true);

    editableDescriptionRef.current?.blur();
  }

  function completeEdit(evt: React.FocusEvent) {
    const newDescription = (evt.target as HTMLInputElement).value;

    setEditMode(false);

    setDescription(newDescription);

    // update user profile here
    if (description !== newDescription) props.mutateDescription({ taskId: props.id ?? "", stageId: props.stageId ?? "" }, newDescription);
  }

  // description is passed into sc because react complains about contentdeditable having children
  return (
    <Wrapper
      draggable={!editMode}
      highlighted={editMode}
      onDoubleClick={evt => startEdit(evt)}
      onDragOver={evt => evt.preventDefault()}
      onDragStart={evt => {
        evt.dataTransfer.setData("task-id", props.id ?? "no-id");
        props.onDragStart(props.stageId ?? "none", props.id ?? "none");
      }}
    >
      {editMode ? (
        <EditableDescription ref={editableDescriptionRef} onBlur={evt => completeEdit(evt)} defaultValue={description} description={""} />
      ) : (
        <Description ref={descriptionRef} description={description} data-description={description} />
      )}
      <Tags>
        {tags.map(tag => (
            <Tag key={tag.id ?? 'ERROR'} id={tag.id ?? ''} all={props.allTags} taskId={props.id ?? ''} stageId={props.stageId ?? ''} options={props.allTags} mutateTag={props.mutateTag} changeTagIndex={props.changeTagIndex}/>
        ))}
      </Tags>
      <QuickActions id={"actions"}>
        <QuickAction
          icon={"/star.svg"}
          
          onClick={_ => {
            props.addTag({ taskId: props.id ?? "", stageId: props.stageId ?? "" }, { value: "TAG", color: "#CAFE48" })
          }
        }
        >
        </QuickAction>
        <QuickAction icon={"/x-lg.svg"} onClick={_ => {  }}></QuickAction>
      </QuickActions>
    </Wrapper>
  );
}

const Wrapper = styled.div<TaskWrapperProps>`
  color: black;
  background-color: white;
  padding: 0.5rem;
  display: flex;
  column-gap: 1rem;
  user-select: none;
  cursor: grab;

  &:hover {
    outline: solid 2px #7604f1;

    #actions {
      width: 4rem;
    }
  }

  p {
    margin: 0;
  }

  ${props =>
    props.highlighted &&
    css`
      outline: dotted 4px #7604f1;
      outline-offset: -4px;
      user-select: all;
    `}
`;

const Tags = styled.div`
    display: flex;
    column-gap: 0.5rem;
`

const Description = styled.div<TaskNameProps>`
  flex: 1 1 auto;
  background: none;
  outline: none;

  &:focus-visible {
    outline: none;
  }

  &::after {
    content: "${props => props.description}";
  }
`;

const EditableDescription = styled.input<TaskNameProps>`
  border: none;
  font-family: "Prompt";
  font-weight: 500;
  font-size: 1rem;
  user-select: all;
  pointer-events: all;

  flex: 1 1 auto;
  background: none;
  outline: none;

  &:focus-visible {
    outline: none;
  }

  &::after {
    content: "${props => props.description}";
  }
`;

const QuickActions = styled.div`
  display: flex;
  transition: width 0.06s ease-in-out;
  width: 0;
  overflow: hidden;
`;

const QuickAction = styled.button<QuickActionProps>`
  padding-top: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-family: "Prompt";
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #7604f1;
    color: white;

    &::before {
      filter: invert(100%);
    }
  }

  &::before {
    content: "";
    display: inline-block;
    background-image: url(${props => props.icon});
    background-size: 1rem 1rem;
    background-repeat: no-repeat;
    width: 1rem;
    height: 1rem;
    margin-bottom: 0.25rem;
  }
`;
