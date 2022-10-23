import React from 'react';
import { useState } from 'react';
import styled, { css } from 'styled-components';

interface SearchProps {
  whiteBackground: boolean;
  placeholder: string;
  onFilter: (filter: { search: string; contextId: string }) => void;
  contextId: string;
}

interface SearchInputProps {
  whiteBackground: boolean;
  placeholder: string;
}

interface FilterProps {
  selected: boolean;
}

export const SearchContext = React.createContext('');

export default function Search(props: SearchProps) {
  const [filter, setFilter] = useState('ALL');

  return (
    <Wrapper>
      <Icon src="/search.svg" />
      <Input
        whiteBackground={props.whiteBackground}
        defaultValue={''}
        placeholder={props.placeholder}
        onChange={(evt) => props.onFilter({ search: evt.target.value, contextId: props.contextId })}
      />
      <FilterOptions>
        FILTER BY
        <FilterOption selected={filter === 'ALL'} onClick={(_) => setFilter('ALL')}>
          ALL
        </FilterOption>
        <FilterOption selected={filter === 'NAME'} onClick={(_) => setFilter('NAME')}>
          TASK
        </FilterOption>
        <FilterOption selected={filter === 'TAG'} onClick={(_) => setFilter('TAG')}>
          TAG
        </FilterOption>
      </FilterOptions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

const Icon = styled.img`
  position: absolute;
  top: 0.75rem;
  left: 0.5rem;
  opacity: 20%;
`;

const Input = styled.input<SearchInputProps>`
  height: 1.5rem;
  padding: 0.5rem 0.75rem 0.5rem 2rem;
  background-color: #f2fdff44;
  border: none;
  font-size: 1rem;
  font-family: 'Prompt';
  font-weight: 500;
  max-width: 12rem;

  &::placeholder {
    color: lightgray;
  }

  &:focus-visible {
    outline: solid 2px #f2fdff;
  }

  ${(props) => props.whiteBackground && css`
      background-color: #e0e0e0;
      color: black;

      &::placeholder {
        color: gray;
      }
    `}
`;

const FilterOptions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  margin-left: 1rem;
  user-select: none;
  padding: 0;
`;

const FilterOption = styled.p<FilterProps>`
  margin-right: 0rem;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  cursor: pointer;

  ${(props) =>
    props.selected &&
    css`
      background-color: black;
      color: white;
    `}
`;
