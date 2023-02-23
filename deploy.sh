#!/bin/bash
cd $(dirname $0)

ENV="dev"

NAME="cup-tech-test"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)

if [[ -z "$ENV" ]]; then
	echo "Invalid Environment";
	exit 1;
fi

if [[ "${ACCOUNT}" = "756985559157" ]]; then
	REGION="eu-west-2"
else
	echo "Invalid account"
	exit 1;
fi

STACKNAME="${ENV}-${REGION}-${NAME}"

npm run build

aws cloudformation deploy \
	--template-file ./infrastructure/template.yaml \
	--stack-name ${STACKNAME} \
	--region ${REGION} \
	--capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND \
	--parameter-overrides $(cat ./infrastructure/parameters.json |jq -r '.[] | to_entries|map("\(.key)=\(.value|tostring)")|.[]')

WEB_BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name dev-eu-west-2-cup-tech-test --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text )
DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name dev-eu-west-2-cup-tech-test --query 'Stacks[0].Outputs[?OutputKey==`CloudfrontDistribution`].OutputValue' --output text )

aws s3 sync ./build s3://${WEB_BUCKET_NAME} --delete

aws cloudfront create-invalidation --no-cli-pager --distribution-id $DISTRIBUTION_ID --paths "/*"
