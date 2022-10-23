import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";
import yeast from "yeast";
import { usePushableState } from "../interactivity";
import { Stage } from "./Board";

export interface TaskProps {
  id?: string;
  description: string;
  tags: string[];
  stageId?: string;
}

export interface TaskWrapperProps {
  highlighted: boolean;
}

export interface TaskNameProps {
  description: string;
}

export default function Task(
  props: TaskProps & {
    onDragStart: (stageId: string, taskId: string) => void;
    mutateDescription: (context: { taskId: string; stageId: string }, description: string) => void;
  }
) {
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState(props.description);
  const [tags, pushTag] = usePushableState(props.tags);

  let descriptionRef = useRef<HTMLDivElement>(null);
  let editableDescriptionRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setEditMode(true);

    editableDescriptionRef.current?.blur();
  }

  function completeEdit(evt: React.FocusEvent) {
    const newDescription = (evt.target as HTMLInputElement).value;

    setEditMode(false);

    setDescription(newDescription);

    // update user profile here
    if (description !== newDescription) props.mutateDescription({ taskId: props.id ?? "", stageId: props.stageId ?? '' }, newDescription);
  }

  // description is passed into sc because react complains about contentdeditable having children
  return (
    <Wrapper
      draggable={!editMode}
      highlighted={editMode}
      onDoubleClick={_ => startEdit()}
      onDragOver={evt => evt.preventDefault()}
      onDragStart={evt => {
        evt.dataTransfer.setData("task-id", props.id ?? "no-id");
        props.onDragStart(props.stageId ?? 'none', props.id ?? 'none');
      }}
    >
      {editMode ? (
        <EditableDescription ref={editableDescriptionRef} onBlur={evt => completeEdit(evt)} defaultValue={description} description={""} />
      ) : (
        <Description ref={descriptionRef} description={description} data-description={description} />
      )}
      {tags.map(tag => (
        <Tag key={yeast()} color={"#CAFE48"}>
          {tag}
        </Tag>
      ))}
      <QuickActions>
        <QuickAction></QuickAction>
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

  &:hover {
    outline: solid 2px #7604f1;
  }

  ${props =>
    props.highlighted &&
    css`
      outline: dotted 4px #7604f1;
      outline-offset: -4px;
      user-select: all;
    `}
`;

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

const Tag = styled.div`
  background-color: #cafe48;
  color: black;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
`;


const QuickActions = styled.div`
    border-left: solid 2px #7604f1;
    display: flex;
`

const QuickAction = styled.button`
    
`