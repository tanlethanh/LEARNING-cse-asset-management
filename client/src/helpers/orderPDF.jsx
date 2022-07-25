import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../styles/pdf.css'

const OrderPDF = ({ user, order, className }) => {

    const exportPDF = () => {
        const input = document.getElementById("pdf")
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('img/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                pdf.addImage(imgData, 'PNG', 1, 1);
                pdf.save("order.pdf");
            });
    }

    return (
        <div className={"list-item-col " + className}>
            <i onClick={exportPDF} className="fa-solid fa-download accept"></i>
            <div
                id="pdf"
                style={{
                    position: "fixed",
                    left: "100vw",
                    width: "790px",
                    color: "black"
                }}>
                <h1>Phiếu nhận đồ đã đăng ký mượn</h1>
                <div className='pdf_content'>
                    <h3>Thông tin người mượn</h3>
                    <p>Họ và tên: {user.fullName}</p>
                    <p>MSSV: {user.studentCode}</p>
                    <p>Email: {user.email}</p>
                    <p>Số điện thoại: {user.phoneNumber}</p>
                    <h3>Đơn hàng</h3>
                    <p>Mã đơn hàng: {order._id}</p>
                    <p>Tên đồ dùng mượn: {order.nameItem}</p>
                    <p>Phân loại: {order.categoryItem}</p>
                    <p>Số lượng: {order.quantity}</p>
                    <p>Ngày trả (mm/dd/yyyy): {new Date(order.returnDate).toLocaleDateString()} </p>
                </div>
            </div>
        </div>
    )
};


export default OrderPDF;