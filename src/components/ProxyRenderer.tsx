import React, { FC, useCallback, useContext } from "react";
import styled from "styled-components";
import { setRendererRect } from "../state/actions";
import { MainContext } from "../state";
import { IStyledProps } from "../types";
import useDocumentLoader from "../utils/useDocumentLoader";
import useWindowSize from "../utils/useWindowSize";

const ProxyRenderer: FC<{}> = () => {
  const { CurrentRenderer } = useDocumentLoader();

  const size = useWindowSize();
  const {
    state: { currentDocument, documentLoading },
    dispatch,
  } = useContext(MainContext);

  const containerRef = useCallback(
    (node) => node && dispatch(setRendererRect(node?.getBoundingClientRect())),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size]
  );

  const Contents = () => {
    if (documentLoading) {
      return <div>{/*Loading*/}</div>;
    } else {
      if (CurrentRenderer) {
        return <CurrentRenderer />;
      } else {
        return <div>No Renderer for file type {currentDocument?.fileType}</div>;
      }
    }
  };

  return (
    <Container ref={containerRef}>
      <Contents />
    </Container>
  );
};

export default ProxyRenderer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  /* width */
  &::-webkit-scrollbar {
    ${(props: IStyledProps) => {
      return props.theme.disableThemeScrollbar ? "" : "width: 10px";
    }};
  }
  /* Track */
  &::-webkit-scrollbar-track {
    /* background: ${(props: IStyledProps) => props.theme.secondary}; */
  }
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${(props: IStyledProps) => props.theme.tertiary};
  }
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props: IStyledProps) => props.theme.primary};
  }
`;