import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Text from "../../components/Text";
import {
  Switch,
  Form,
  Input,
  DatePicker,
  Upload,
  InputNumber,
  Cascader,
  message,
  Image,
} from "antd";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { upLoadImages } from "../../services/uploadImage";
import { updateProduct, get } from "../../services/productApi";
import { useSelector } from "react-redux";
import { getAll as getAllCategory } from "../../services/categoryApi";
import ReactHtmlParser from "react-html-parser";
import { BACKEND_DOMAIN } from "../../constants";
import { sendChangeDescriptionNotification } from "../../services/email";

export default function EditProductPage(props) {
  const [form] = Form.useForm();
  const [autoRenew, setAutoRenew] = useState(false);
  const [isAllUser, setIsAllUser] = useState(true);
  const [fileList, setFileList] = useState([]);
  const dateFormat = "DD/MM/YYYY HH:mm:ss";
  const [images, setImages] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { user } = useSelector((state) => state.user);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [errorImages, setErrorImages] = useState(false);
  const [errorDes, setErrorDes] = useState(false);
  const { product } = props;
  const [currentProd, setCurrentProd] = useState(props?.product);
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    get(product?.id).then((product) => {
      setCurrentProd(product);
    });
  }, [isReload]);
  useEffect(() => {
    const fetchData = async () => {
      const allCategory = await getAllCategory();
      const options = allCategory.map((category) => {
        return {
          value: category.id,
          label: category.name,
          children: category.subCategory.map((sub) => {
            return {
              value: sub.id,
              label: sub.name,
            };
          }),
        };
      });
      setCategoryOptions(options);
    };
    fetchData();
  }, []);

  const onEditorStateChange = (editorState) => {
    if (
      !editorState.getCurrentContent().hasText() ||
      editorState.getCurrentContent().getPlainText().trim() === ""
    ) {
      setErrorDes(true);
    } else {
      setErrorDes(false);
    }
    setEditorState(editorState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileList.length < 3) {
      setErrorImages(true);
    } else if (
      !editorState.getCurrentContent().hasText() ||
      editorState.getCurrentContent().getPlainText().trim() === ""
    ) {
      setErrorDes(true);
    } else {
      form.submit();
    }
  };

  const onFinish = (values) => {
    console.log("???");
    const data = {
      description:
        product?.description +
        "\n" +
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };

    updateProduct(product?.id, data)
      .then(async (result) => {
        message.success("C???p nh???t s???n ph???m th??nh c??ng");
        form.resetFields();
        setImages([]);
        setFileList([]);
        setEditorState(EditorState.createEmpty());
        setIsReload(!isReload);

        await sendChangeDescriptionNotification({
          product: props?.product,
        });
      })
      .catch((error) => message.error(error.message));
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className={styles.addProductPage}>
      <div className={styles.content}>
        <div className={styles.left}>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            name="basic"
            autoComplete="off"
            initialValues={{
              remember: true,
            }}
          >
            <div>
              <div style={{ marginBottom: "8px" }}>
                <label>
                  <Text.caption title="T??n s???n ph???m" />
                </label>
              </div>
              <Form.Item
                name="name"
                rules={[
                  {
                    required: true,
                    message: "T??n s???n ph???m kh??ng ???????c tr???ng!",
                  },
                ]}
              >
                <Input
                disabled={true} 
                placeholder={product?.title} />
              </Form.Item>
            </div>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <label className={styles.inputLabel}>
                  <Text.caption title="Gi?? kh???i ??i???m" />
                </label>
              </div>
              <Form.Item
                name="price"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(
                          "Gi?? kh???i ??i???m kh??ng ???????c tr???ng."
                        );
                      }
                      if (value < 0) {
                        return Promise.reject("Gi?? kh???i ??i???m kh??ng h???p l???.");
                      }
                      if (!parseInt(value)) {
                        return Promise.reject("Gi?? kh???i ??i???m kh??ng h???p l???.");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                 disabled={true} 
                  placeholder={product?.startPrice}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div>
              <div style={{ marginBottom: "8px" }}>
                <label className={styles.inputLabel}>
                  <Text.caption title="B?????c gi??" />
                </label>
              </div>
              <Form.Item
                name="priceStep"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject("B?????c gi?? kh??ng ???????c tr???ng.");
                      }
                      if (value < 0) {
                        return Promise.reject("B?????c gi?? kh??ng h???p l???.");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                 disabled={true} 
                  placeholder={product?.priceStep}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>

            <div>
              <div style={{ marginBottom: "8px" }}>
                <label className={styles.inputLabel}>
                  <Text.caption title="Gi?? mua ngay" />
                </label>
              </div>
              <Form.Item
                name="maxPrice"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject("Gi?? mua ngay kh??ng h???p l???.");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                 disabled={true} 
                  placeholder={product?.maxPrice}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>

        <div className={styles.right}>
          <div className={styles.upload}>
            <div style={{ marginBottom: "8px" }}>
              <label className={styles.inputLabel}>
                <Text.caption title="H??nh ???nh" />
              </label>
            </div>
            {product?.images.map((el) => {
              return (
                <Image
                  width={props?.width || 100}
                  src={`${BACKEND_DOMAIN}${el}`}
                  alt={product.title}
                  preview={false}
                />
              );
            })}
          </div>
          <div>
            <div style={{ marginBottom: "8px" }}>
              <label className={styles.inputLabel}>
                <Text.caption title="M?? t??? s???n ph???m" />
              </label>
            </div>
            <div className={styles.textEditor}>
              <div>{ReactHtmlParser(currentProd.description)}</div>
              <Editor
                editorState={editorState}
                toolbarClassName={styles.toolbar}
                wrapperClassName="wrapperClassName"
                editorClassName={styles.editor}
                onEditorStateChange={onEditorStateChange}
                //onContentStateChange={onContentStateChange}
              />
            </div>
            {errorDes && (
              <span className={styles.errorMess}>M?? t??? s???n ph???m tr???ng!</span>
            )}
            <div className={styles.submit}>
              <button className={styles.btn} onClick={() => onFinish()}>
                <Text.bodyHighlight title="C???p nh???t" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
