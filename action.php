<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include "db_config.php";

$postjson = json_decode(file_get_contents('php://input'), true);
$aksi = isset($postjson['aksi']) ? strip_tags($postjson['aksi']) : null;

$data = array();

if (!$aksi) {
    echo json_encode(['success' => false, 'msg' => 'Aksi tidak dikirim']);
    exit;
}

switch ($aksi) {
    case "add_register":
        $nama = filter_var($postjson['nama'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $nohp = filter_var($postjson['nohp'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $email = filter_var($postjson['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $prodi = filter_var($postjson['prodi'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $tahunlulus = filter_var($postjson['tahunlulus'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

        try {
            $sql = "INSERT INTO alumni (nama, nohp, email, prodi, tahunlulus) VALUES (:nama, :nohp, :email, :prodi, :tahunlulus)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':nama', $nama, PDO::PARAM_STR);
            $stmt->bindParam(':nohp', $nohp, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':prodi', $prodi, PDO::PARAM_STR);
            $stmt->bindParam(':tahunlulus', $tahunlulus, PDO::PARAM_STR);
            $stmt->execute();

            $result = json_encode(['success' => true]);
            echo $result;
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => $e->getMessage()]);
        }
        break;

    case "getdata":
        $limit = filter_var($postjson['limit'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $start = filter_var($postjson['start'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

        try {
            $sql = "SELECT * FROM alumni ORDER BY id DESC LIMIT :start, :limit";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':start', $start, PDO::PARAM_INT);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as $row) {
                $data[] = [
                    'id' => $row['id'],
                    'nama' => $row['nama'],
                    'nohp' => $row['nohp'],
                    'email' => $row['email'],
                    'prodi' => $row['prodi'],
                    'tahunlulus' => $row['tahunlulus']
                ];
            }

            $result = json_encode(['success' => true, 'result' => $data]);
            echo $result;
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'msg' => $e->getMessage()]);
        }
        break;
}