import React, { useCallback } from 'react';
import { Button } from '@carbon/react';
import { launchWorkspace2 } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';

interface StartVisitButtonProps {
  patientUuid?: string;
  disabled?: boolean;
  kind?: React.ComponentProps<typeof Button>['kind'];
  size?: React.ComponentProps<typeof Button>['size'];
}

const StartVisitButton: React.FC<StartVisitButtonProps> = ({
  patientUuid,
  disabled = false,
  kind = 'primary',
  size = 'md',
}) => {
  const { t } = useTranslation();

  const handleLaunchWorkspace = useCallback(() => {
    if (!patientUuid || disabled) {
      return;
    }

    launchWorkspace2('patient-queues-start-visit-form-workspace', {
      patientUuid,
      showPatientHeader: true,
    });
  }, [disabled, patientUuid]);

  return (
    <Button
      kind={kind}
      size={size}
      disabled={disabled || !patientUuid}
      onClick={handleLaunchWorkspace}
      aria-label={t('startAVisit', 'Start a visit')}
    >
      {t('startAVisit', 'Start a visit')}
    </Button>
  );
};

export default StartVisitButton;
