import React from "react";
import { Container } from "react-bootstrap";
import { tableHeaders } from "../../constants/helpers";
import Styles from "./Styles";
import Table from "./Table";

const AuctionItemsTable = ({ auctionItems }) => {
  const data = auctionItems;

  const columns = React.useMemo(() => tableHeaders, []);

  return (
    <>
      <Container style={{ marginTop: "5px" }}>
        <Styles>
          <Table columns={columns} data={data} />
        </Styles>
      </Container>
    </>
  );
};

export default AuctionItemsTable;
