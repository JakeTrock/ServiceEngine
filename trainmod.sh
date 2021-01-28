cd inputprocessor && npm run export && cd ..
cd Magnum-NLC2CMD
 python3 main.py --mode preprocess --data_dir src/data --data_file nl2bash-data.json and cd src/model && onmt_build_vocab -config
nl2cmd.yaml -n_sample 10347 --src_vocab_threshold 2 --tgt_vocab_threshold 2
cd src/model && onmt_train -config nl2cmd.yaml

cp src/model/run/model_step_2000.pt ../mlOutput/
cp src/data/invocations_proccess_test.txt ../mlOutput/
