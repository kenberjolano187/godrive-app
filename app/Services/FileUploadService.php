<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

class FileUploadService
{
    private string $uploadPath = 'images/uploads';

    public function upload(UploadedFile $file): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path($this->uploadPath), $filename);
        
        return $this->uploadPath . '/' . $filename;
    }

    public function delete(?string $path): bool
    {
        if (!$path) {
            return false;
        }

        $fullPath = public_path($path);
        
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }

    public function setUploadPath(string $path): self
    {
        $this->uploadPath = $path;
        return $this;
    }
}