import { useState } from "react";
import styled from "styled-components";
import yeast from "yeast";

export interface TagProps {
  value: string;
  color: string;
  id?: string;
}

export interface TagIndex {
  id: string;
}

export interface TagSelectorProps {
  options: TagProps[];
}

export default function Tag(
  props: TagIndex & 
    TagSelectorProps & { all: TagProps[], taskId: string, stageId: string } & {
      mutateTag: (tagID: string, mutation: TagProps) => void;
      changeTagIndex: (context: { taskId: string; stageId: string; tagId: string }, tagIndex: string) => void;
    }
) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const unindexedTab = props.all.find(tag => tag.id === props.id) ?? { value: "", color: "red" };

  function startEdit(evt: React.MouseEvent) {
    setEditMode(true);
    evt.stopPropagation();
    evt.preventDefault();
    setOpen(false)
  }

  function completeEdit(evt: React.FocusEvent | React.KeyboardEvent) {
    props.mutateTag(props.id, {
      value: (evt.target as HTMLInputElement).value,
      color: unindexedTab.color,
      id: unindexedTab.id
    });
    setEditMode(false);
  }

  return (
    <Wrapper>
      {editMode ? (
        <EditableOption
          defaultValue={unindexedTab.value}
          color={unindexedTab.color}
          onBlur={evt => completeEdit(evt)}
          onKeyUp={evt => {
            if (evt.key === "Enter") completeEdit(evt);
          }}
        />
      ) : (
        <Option value={unindexedTab.value} color={unindexedTab.color} onClick={_ => setOpen(!open)} onDoubleClick={evt => startEdit(evt)}>
          {unindexedTab.value}
        </Option>
      )}
      <Combo>
        {open &&
          props.options
            .filter(tag => tag.id !== unindexedTab.id)
            .map(option => {
              return (
                <Option
                  value={option.value}
                  color={option.color}
                  onClick={_ => {
                    props.changeTagIndex({taskId: props.taskId, stageId: props.stageId, tagId: props.id}, option.id ?? '')
                    setOpen(false);
                  }}
                >
                  {option.value}
                </Option>
              );
            })}
      </Combo>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

const Option = styled.div<TagProps>`
  background-color: #CAFE48;
  color: black;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  cursor: pointer;
`;

const EditableOption = styled.input`
  border: none;
  font-family: "Prompt";
  font-weight: 500;
  font-size: 1rem;
  user-select: all;
  pointer-events: all;

  background-color: #CAFE48;
  color: black;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  cursor: pointer;
`;

const Combo = styled.div`
  height: 0;
  position: relative;
`;
