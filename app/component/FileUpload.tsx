import {
  Button,
  Modal,
  DropZone,
  Checkbox,
  Frame,
  Box,
  Thumbnail,
  BlockStack,
  Text,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { PrismaClient } from "@prisma/client";
import { NoteIcon } from "@shopify/polaris-icons";
import { API_URL } from "utils/env";

const prisma = new PrismaClient();

export async function loader({ request }: any) {}

export async function action({ request }: any) {}

export const FileUpload = ({
  toggleActive,
  active,
  setPopuupEvent,
  fetchData,
}: any) => {
  const [checked, setChecked] = useState(false);
  const [audioFile, setAudioFile] = useState<any>(null);

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", audioFile);
      const response = await fetch(`${API_URL}/api/audio`, {
        method: "post",
        // headers: { "Content-Type": "application/json" },
        body: formData,
      }); // Replace with your API endpoint
      const data = await response.json();
      if (data) {
        shopify.toast.show(data.message);
        fetchData();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCheckbox = useCallback((value: boolean) => setChecked(value), []);

  return (
    <div style={{ height: "800px" }}>
      <Frame>
        <Modal
          size="large"
          open={!active}
          onClose={() => {
            setAudioFile(null);
            setPopuupEvent(String(Math.random()));
            toggleActive();
          }}
          title="Import Your Files"
          primaryAction={{
            content: "Submit",
            onAction: () => {
              handleFileUpload();
              setPopuupEvent(String(Math.random()));
              toggleActive();
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => {
                setAudioFile(null);
                setPopuupEvent(String(Math.random()));
                toggleActive();
              },
            },
          ]}
        >
          <Modal.Section>
            <Box>
              <DropZone
                accept="*"
                errorOverlayText="File type must be .csv"
                type="file"
                onDrop={(files) => {
                  setAudioFile(files[0]);
                }}
              >
                {audioFile ? (
                  <BlockStack align="center" inlineAlign="center">
                    <Box padding="100">
                      <Thumbnail
                        source={NoteIcon}
                        size="large"
                        alt="Small document"
                      />
                    </Box>
                    <Text variant="headingSm" as="h6">
                      {String(audioFile["name"])}
                    </Text>
                  </BlockStack>
                ) : (
                  <DropZone.FileUpload />
                )}
              </DropZone>
            </Box>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
};
