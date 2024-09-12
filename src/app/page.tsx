"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Col, notification, Row, Select, Table } from "antd";
import { Item } from "@/utils/helper/types/Items";
import {
  defaultPageParameters,
  PageParameters,
  SortField,
  sortOptions,
  SortOrder
} from "@/utils/constants";

const columns = [
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt"
  },
  {
    title: "Filename",
    dataIndex: "filename",
    key: "filename"
  }
];

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchItems = async (params: PageParameters) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/items?sortField=${sortField}&sortOrder=${sortOrder}&page=${params.pageNumber}&pageSize=${params.pageSize}`
      );
      const data = await response.json();
      setItems(data.data);
      setTotal(data.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
      notification["error"]({
        message: "Error",
        description: "Error fetching items"
      });
    }
  };

  useEffect(() => {
    fetchItems(defaultPageParameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortOrder]);

  const handleSortChange = (value: string) => {
    if (value.includes("created_at")) {
      setSortField("created_at");
    } else if (value.includes("filename")) {
      setSortField("filename");
    }
    setSortOrder(value.includes("asc") ? "asc" : "desc");
  };

  const handleTableChange = (pageNumber: number, pageSize: number) => {
    setPageNumber(pageNumber);
    setPageSize(pageSize);
    fetchItems({ pageNumber, pageSize });
  };

  const title = sortOptions.find(
    (option) => option.value === `${sortField}_${sortOrder}`
  )?.label;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20
          }}
        >
          <Col>
            <label className={styles.label}>Sort By:</label>
            <Select
              style={{ width: 200 }}
              onChange={handleSortChange}
              defaultValue="created_at_asc"
            >
              {sortOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <h1 className={styles.title}>{`Items Sorted By ${title}`}</h1>
        <Table
          dataSource={items}
          columns={columns}
          rowKey="filename"
          loading={loading}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: handleTableChange
          }}
          bordered
        />
      </main>
    </div>
  );
}
