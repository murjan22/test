import { useState } from "react";
import { Button, Table } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "./Documents.css";

type attachmentsMode = {
  id: string;
  name: string;
  url: string;
};

type dataModel = {
  id: string;
  documentType: string;
  documentSubType: string;
  description: string;
  startDate: string;
  endDate: string;
  attachments: attachmentsMode[];
};

type slideType = {
  src: string;
  type: 'image' | 'pdf';
  name?: string;
};

type props = {
  data: dataModel[];
};

function Documents({ data }: props) {
  const [openLightBox, setOpenLightBox] = useState(false);
  const [slides, setSlides] = useState<slideType[]>([]);

  // Helper function to check if file is PDF
  const isPdfFile = (url: string): boolean => {
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');
  };

  // Helper function to check if file is an image
  const isImageFile = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  const handleOpenLightBox = (attachments?: attachmentsMode[]) => {
    if (attachments && attachments.length > 0) {
      const slideData = attachments.map((attachment) => {
        if (isPdfFile(attachment.url)) {
          return {
            src: attachment.url,
            type: 'pdf' as const,
            name: attachment.name
          };
        } else if (isImageFile(attachment.url)) {
          return {
            src: attachment.url,
            type: 'image' as const,
            name: attachment.name
          };
        }
        return null;
      }).filter((slide): slide is slideType => slide !== null);

      setSlides(slideData);
      setOpenLightBox(true);
    }
  };

  return (
    <div>
      <Table
        id="delete-datatable"
        className="table table-bordered text-nowrap border-bottom"
      >
        <thead>
          <tr>
            <th>Document Type</th>
            <th>Document Sub Type</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Attachments</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item, i) => {
            return (
              <tr
                key={item.id}
                style={{ height: "60px", verticalAlign: "middle" }}
              >
                <td>{item.documentType}</td>
                <td>{item.documentSubType}</td>
                <td>{item.description}</td>
                <td>{item.endDate?.split("T")[0]}</td>
                <td>{item.startDate?.split("T")[0]}</td>

                <td>
                  <Button
                    variant="primary"
                    className="btn btn-icon btn-primary rounded-pill btn-wav me-1"
                    onClick={() => {
                      handleOpenLightBox(item.attachments);
                    }}
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Lightbox for both images and PDFs */}
      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        plugins={[Fullscreen, Thumbnails, Zoom, Slideshow]}
        zoom={{
          maxZoomPixelRatio: 10,
          scrollToZoom: true,
        }}
        slides={slides}
        render={{
          slide: ({ slide, offset, rect }) => {
            if (slide.type === 'pdf') {
              return (
                <div
                  style={{
                    width: rect.width,
                    height: rect.height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8f9fa',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: '#e9ecef',
                        borderBottom: '1px solid #dee2e6',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#495057'
                      }}
                    >
                      {slide.name || 'PDF Document'}
                    </div>
                    <iframe
                      src={slide.src}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        flex: 1
                      }}
                      title={slide.name || 'PDF Document'}
                    />
                  </div>
                </div>
              );
            }
            // For images, use default rendering
            return undefined;
          },
          thumbnail: ({ slide, rect, render }) => {
            if (slide.type === 'pdf') {
              return (
                <div
                  style={{
                    width: rect.width,
                    height: rect.height,
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#6c757d'
                    }}
                  >
                    <i 
                      className="bi bi-file-pdf" 
                      style={{ 
                        fontSize: '24px', 
                        marginBottom: '4px',
                        display: 'block'
                      }}
                    ></i>
                    <div style={{ fontSize: '10px', wordBreak: 'break-word' }}>
                      {slide.name || 'PDF'}
                    </div>
                  </div>
                </div>
              );
            }
            return undefined;
          }
        }}
      />
    </div>
  );
}

export default Documents;