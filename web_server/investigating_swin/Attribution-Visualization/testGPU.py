import tensorflow as tf

if tf.test.is_gpu_available(cuda_only=False, min_cuda_compute_capability=None):
    print("TensorFlow can use the GPU")
else:
    print("TensorFlow cannot use the GPU")

