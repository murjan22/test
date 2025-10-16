import { useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
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
type props = {
  data: dataModel[];
};

function Documents({ data }: props) {
  const [openLightBox, setOpenLightBox] = useState(false);
  const [openPdfModal, setOpenPdfModal] = useState(false);
  const [slides, setSlides] = useState<{ src: string }[]>([]);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>("");
  const [currentPdfName, setCurrentPdfName] = useState<string>("");

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
      // Separate images and PDFs
      const imageAttachments = attachments.filter(attachment => 
        isImageFile(attachment.url)
      );
      const pdfAttachments = attachments.filter(attachment => 
        isPdfFile(attachment.url)
      );

      // If there are images, show them in lightbox
      if (imageAttachments.length > 0) {
        const slideImages = imageAttachments.map((img) => ({
          src: img.url,
        }));
        setSlides(slideImages);
        setOpenLightBox(true);
      }

      // If there are PDFs, show the first one in PDF modal
      if (pdfAttachments.length > 0) {
        setCurrentPdfUrl(pdfAttachments[0].url);
        setCurrentPdfName(pdfAttachments[0].name);
        setOpenPdfModal(true);
      }
    }
  };

  const handlePdfClose = () => {
    setOpenPdfModal(false);
    setCurrentPdfUrl("");
    setCurrentPdfName("");
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

      {/* Lightbox for images */}
      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        plugins={[Fullscreen, Thumbnails, Zoom, Slideshow]}
        zoom={{
          maxZoomPixelRatio: 10,
          scrollToZoom: true,
        }}
        slides={slides}
      />

      {/* Modal for PDFs */}
      <Modal
        show={openPdfModal}
        onHide={handlePdfClose}
        size="xl"
        centered
        className="pdf-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentPdfName}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, height: "80vh" }}>
          {currentPdfUrl && (
            <iframe
              src={currentPdfUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title={currentPdfName}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Documents;